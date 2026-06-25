import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard server-side initialization of Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please add it in your Secrets configurations.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

/**
 * Robust HTML parser/text-extractor
 */
function extractCleanText(html: string): { title: string; cleanText: string } {
  let title = "Web Source";
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim()
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'");
  }

  // Strip scripts and styles
  let clean = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Convert divs, paragraphs, headers & breaks to readable spacing
  clean = clean
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n");

  // Remove other tags
  clean = clean.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  clean = clean
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");

  // Format whitespace
  clean = clean.replace(/[ \t]+/g, " ");
  clean = clean.replace(/\n\s*\n+/g, "\n\n");

  return {
    title,
    cleanText: clean.trim().substring(0, 18000), // Keep a generous but safe body token limits
  };
}

// 1. Scrape endpoint
app.post("/api/scrape", async (req, res): Promise<any> => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const fetchResponse = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch URL. HTTP status: ${fetchResponse.status}`);
    }

    const html = await fetchResponse.text();
    const { title, cleanText } = extractCleanText(html);

    if (!cleanText || cleanText.length < 20) {
      throw new Error("No readable text could be scraped from the page. Please check the URL or paste rough notes instead.");
    }

    return res.json({ title, text: cleanText });
  } catch (error: any) {
    console.error("Scraping error:", error);
    return res.status(500).json({
      error: error.message || "Could not access or read the URL. Please verify the link is public and supports direct scraping, or feel free to paste rough notes."
    });
  }
});

// 2. Generate content endpoint
app.post("/api/generate", async (req, res): Promise<any> => {
  const { source, sourceType, style, audience, toneKeywords, companyDetails } = req.body;

  if (!source) {
    return res.status(400).json({ error: "Source notes or scraped text are required" });
  }

  try {
    const ai = getGeminiClient();

    let companyContext = "";
    if (companyDetails && companyDetails.companyName) {
      companyContext = `
THE FOUNDER'S COMPANY PROFILE:
- Company Name: ${companyDetails.companyName}
- Website: ${companyDetails.website || "Not provided"}
- Industry/Niche: ${companyDetails.industry || "Not provided"}
- What we do/Product Description: ${companyDetails.productDescription || "Not provided"}
- Target Audience/Persona: ${companyDetails.targetAudience || "Not provided"}
- Core Brand Tone: ${companyDetails.toneOfVoice || "Not provided"}

Please make sure the generated content is highly relevant, contexts our product/service accurately, and references our company name ("${companyDetails.companyName}") naturally if appropriate. Avoid generic posts. Make it sound like it's specifically written for this company.`;
    }

    const systemInstruction = `You are "Content Engine" - an elite social media ghostwriter and strategist for startup founders.
You turn rough source notes, pitch decks, ideas, or articles into platform-optimized, high-impact copy.
You generate posts for four major platforms all at once:
1. LinkedIn (Professional, narrative lessons, spacious formatting, 1-3 line hooks, 3-5 high quality hashtags)
2. X/Twitter (Punchy, under 280 characters strictly, bold statement hooks, bullet speed-learnings, high visual alignment)
3. Instagram (Engaging caption with visual hook, detailed description of carousel slide design or focal image graphic, list of relevant tags)
4. Reddit (catchy and community-native post with an informative Title and a Markdown Body formatted for tech/founder subreddits. Must be value-first, zero marketing fluff/hype, raw details and structured list of lessons).
${companyContext}

You are generating posts customized with the following parameters:
- Hook/Narrative Style Choice: ${style || "Thought Leadership"}
- Target Audience/Persona: ${audience || "General Tech Public"}
- Custom Tone Keywords: ${toneKeywords ? toneKeywords.join(", ") : "Engaging, crisp, actionable"}

IMPORTANT WRITING STYLE GUIDELINES FOR FOUNDERS:
- Never sound like an generic AI. Avoid buzzwords like "In today's fast-paced digital landscape", "delve deeper", "testament", "tapestry", "buckle up", "paradigm shift".
- Write human-sounding lines, active voice, bold opinions, concrete metrics, and direct advice.
- Respect character limits strictly: X/Twitter MUST be under 280 characters.
- Ensure the Reddit post feels humble, conversational, and raw, sharing actionable playbooks or clear summaries.
- Ensure the Instagram slide proposal details how to structure a carousel visual based on the post.`;

    const userPrompt = `Generate all platform posts based on this source text (${sourceType === "url" ? "scraped article" : "rough notes"}):
---
${source}
---

Output response in complete, well-formed JSON format matching the schema exactly. Ensure character limits are thoroughly verified inside your text generations before returning.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceSummary: {
              type: Type.STRING,
              description: "Brief 1-2 sentence high-level executive summary of this content core topic",
            },
            posts: {
              type: Type.OBJECT,
              properties: {
                linkedin: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Highly engaging, professional story post. Clean line spacing, engaging hook, emoji enhancements, tags at the bottom" },
                    hook: { type: Type.STRING, description: "The opening hook line" },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    characterCount: { type: Type.INTEGER },
                  },
                  required: ["content", "hook", "hashtags", "characterCount"],
                },
                x: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Under 280 characters text. Extreme punch vector, no fluff, concise spacing, sharp hook, optional hashtags" },
                    hook: { type: Type.STRING, description: "High-impact opening sentence" },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    characterCount: { type: Type.INTEGER },
                  },
                  required: ["content", "hook", "hashtags", "characterCount"],
                },

                instagram: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Fascinating description and caption text. Highlights the graphics slides, includes relatable dialogue or metrics" },
                    visualSuggestion: { type: Type.STRING, description: "Detailed directive for image content, carousel structure slide-by-slide, or infographic mockups" },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    characterCount: { type: Type.INTEGER },
                  },
                  required: ["content", "visualSuggestion", "hashtags", "characterCount"],
                },
                reddit: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Reddit thread title following r/startups etiquette" },
                    content: { type: Type.STRING, description: "Detailed markdown body. Rich paragraph structure, honest look, no self-promotion unless asked" },
                    subredditSuggestion: { type: Type.STRING, description: "E.g., r/startups, r/entrepreneur, r/saas, r/SideProject" },
                    characterCount: { type: Type.INTEGER },
                  },
                  required: ["title", "content", "subredditSuggestion", "characterCount"],
                },
              },
              required: ["linkedin", "x", "instagram", "reddit"],
            },
          },
          required: ["sourceSummary", "posts"],
        },
      },
    });

    const bodyText = response.text ? response.text.trim() : "";
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (parseErr) {
      console.error("JSON parsing failure of Gemini output. Output was:", bodyText);
      throw new Error("The GenAI model returned a malformed response format. Please try running generation again.");
    }

    return res.json(data);
  } catch (err: any) {
    console.error("Generation error:", err);
    return res.status(500).json({ error: err.message || "An unexpected error occurred during posts generation. Check your server settings." });
  }
});

// 3. Refine a single channel post endpoint
app.post("/api/refine", async (req, res): Promise<any> => {
  const { platform, currentContent, refinePrompt, originalSource, companyDetails } = req.body;

  if (!platform || !currentContent || !refinePrompt) {
    return res.status(400).json({ error: "Missing required refine inputs" });
  }

  try {
    const ai = getGeminiClient();

    let companyContext = "";
    if (companyDetails && companyDetails.companyName) {
      companyContext = `
THE FOUNDER'S COMPANY PROFILE:
- Company Name: ${companyDetails.companyName}
- Website: ${companyDetails.website || "Not provided"}
- Industry/Niche: ${companyDetails.industry || "Not provided"}
- What we do/Product Description: ${companyDetails.productDescription || "Not provided"}
- Target Audience/Persona: ${companyDetails.targetAudience || "Not provided"}
- Core Brand Tone: ${companyDetails.toneOfVoice || "Not provided"}

Make sure any rewritten post remains highly relevant and contextually aligned with this profile.`;
    }

    const systemInstruction = `You are "Content Engine" - an elite social media strategist for startup founders.
The user wants to refine/revise a specific social media post for the channel: "${platform}".
The user has provided the current post content and feedback instruction. Rewrite the post to fully satisfy the feedback while remaining highly tailored to the specific channel style rules and size limits.
${companyContext}

CHANNEL STYLE GUIDE REMINDERS:
- LinkedIn: narrative, spacing, story-oriented hook.
- X/Twitter: strictly under 280 chars, absolute punch, no fluff.
- Instagram: visual caption with clear image layout/ideas.
- Reddit: Markdown, humble and factual, subreddit suited.

Never mock, never include conversational banter (e.g. "Sure, here's your revised post:"). Output response ONLY in well-formed JSON matching the refinement schema.`;

    const userInstructions = `Original Source Context:
---
${originalSource || "(Not provided)"}
---

Current Post for ${platform}:
---
${currentContent}
---

Refinement Command / Feedback:
"${refinePrompt}"

Please revise this post carefully. Return the finalized rewritten post in the JSON schema.`;

    // Depending on platform, provide schema
    let platformProperties: any = {};
    if (platform === "reddit") {
      platformProperties = {
        title: { type: Type.STRING, description: "Refined Reddit thread title" },
        content: { type: Type.STRING, description: "Refined Reddit markdown body text" },
        subredditSuggestion: { type: Type.STRING },
        characterCount: { type: Type.INTEGER },
      };
    } else if (platform === "instagram") {
      platformProperties = {
        content: { type: Type.STRING, description: "Refined caption text" },
        visualSuggestion: { type: Type.STRING, description: "Refined carousel slide guide" },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        characterCount: { type: Type.INTEGER },
      };
    } else {
      // linkedin, x
      platformProperties = {
        content: { type: Type.STRING, description: "Refined complete post text copy" },
        hook: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        characterCount: { type: Type.INTEGER },
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInstructions,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: platformProperties,
          required: platform === "reddit" ? ["title", "content", "subredditSuggestion", "characterCount"] : (platform === "instagram" ? ["content", "visualSuggestion", "hashtags", "characterCount"] : ["content", "hook", "hashtags", "characterCount"]),
        },
      },
    });

    const bodyText = response.text ? response.text.trim() : "";
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (parseErr) {
      console.error("JSON parse failure in Refine helper output:", bodyText);
      throw new Error("The GenAI model returned an unparsable revision. Please clarify your edit request.");
    }

    return res.json(data);
  } catch (err: any) {
    console.error("Refinement error:", err);
    return res.status(500).json({ error: err.message || "An unexpected error occurred during refinement." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serve
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Content Engine] Server run in http://localhost:${PORT}`);
  });
}

startServer();
