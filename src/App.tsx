import React, { useState, useEffect } from "react";
import { 
  Sparkles, Link2, FileText, Settings, Award, 
  HelpCircle, Trash2, Heart, Check, Copy, Clock, 
  Search, RefreshCw, AlertCircle, Volume2, Globe, 
  Layers, Smile, ChevronRight, User, ExternalLink, Bookmark,
  Building, ChevronLeft, X, BookOpen, Flame, Laugh, Info
} from "lucide-react";
import { 
  GeneratedPackage, 
  HistoryItem, 
  HOOK_STYLES, 
  TARGET_AUDIENCES, 
  ChannelPost,
  CompanyProfile
} from "./types";
import VisualMockup from "./components/VisualMockup";

const SAMPLE_SOURCES = [
  {
    title: "Venture Capital State 2026",
    type: "text" as const,
    style: "Metric-Heavy",
    audience: "VCs & Investors",
    tones: ["Analytical", "Transparent", "Bullish"],
    text: "New VC data shows a 15% increase in seed round valuations globally, yet compliance and diligence times have elongated by 25%. Early-stage founders must demonstrate robust capital efficiency and reliable unit economics rather than relying on rapid user scale alone to successfully complete due diligence and close deals."
  },
  {
    title: "Solopreneur SaaS Blueprint",
    type: "text" as const,
    style: "Boldly Transparent",
    audience: "Indie Hackers & Builders",
    tones: ["Humble", "Actionable", "Contrarian"],
    text: "I built and launched an automated image resize tool in 48 hours. By posting on Reddit, directories, and social media, we gained our first 10 paying customers in the first week, generating $190 in recurring monthly revenue. Lesson learned: launch MVP immediately, don't wait for perfect aesthetics."
  },
  {
    title: "TechCrunch: Series A shifts",
    type: "url" as const,
    url: "https://techcrunch.com/2026/05/series-a-landscape",
    style: "Thought Leadership",
    audience: "Tech Founders & SaaS creators",
    tones: ["Authoritative", "Strategic"],
    text: "Startups seeking Series A capital face a heavily transformed diligence environment. Traditional milestones of $1M ARR are no longer guarantees of check issuance; instead, partners are deeply evaluating net revenue retention (NRR) rates above 115% and customer payback cycles strictly under 12 months."
  }
];

export default function App() {
  // Main states
  const [sourceType, setSourceType] = useState<"url" | "text">("text");
  const [urlInput, setUrlInput] = useState("");
  const [textNotes, setTextNotes] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Thought Leadership");
  const [selectedAudience, setSelectedAudience] = useState("Tech Founders & SaaS creators");
  
  // Custom tone keywords state
  const [toneInput, setToneInput] = useState("");
  const [toneKeywords, setToneKeywords] = useState<string[]>(["Crisp", "Actionable", "Authentic"]);

  // Application general stats
  const [isScraping, setIsScraping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"linkedin" | "x" | "instagram" | "reddit">("linkedin");
  const [isBulkPostingDemo, setIsBulkPostingDemo] = useState(false);
  const [bulkPostSuccess, setBulkPostSuccess] = useState(false);

  // Active generation output
  const [generatedResult, setGeneratedResult] = useState<GeneratedPackage | null>(null);

  // History state list
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Refine state
  const [isRefining, setIsRefining] = useState(false);

  // Onboarding & Company Profile states
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(() => {
    try {
      const stored = localStorage.getItem("content_engine_company_profile");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("content_engine_company_profile");
      return !stored;
    } catch (e) {
      return true;
    }
  });

  const [onboardingStep, setOnboardingStep] = useState(1);
  
  // Forms for onboarding
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formAudience, setFormAudience] = useState("");
  const [formIndustry, setFormIndustry] = useState("");
  const [formTone, setFormTone] = useState("");
  const [formWebsite, setFormWebsite] = useState("");

  // Sync form inputs when profile opens
  useEffect(() => {
    if (companyProfile) {
      setFormName(companyProfile.companyName || "");
      setFormDesc(companyProfile.productDescription || "");
      setFormAudience(companyProfile.targetAudience || "");
      setFormIndustry(companyProfile.industry || "");
      setFormTone(companyProfile.toneOfVoice || "");
      setFormWebsite(companyProfile.website || "");
    }
  }, [companyProfile]);

  // Help & Info Modals
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);

  // Open profile modal to edit
  const openCompanyProfileEdit = () => {
    setFormName(companyProfile?.companyName || "");
    setFormDesc(companyProfile?.productDescription || "");
    setFormAudience(companyProfile?.targetAudience || "");
    setFormIndustry(companyProfile?.industry || "");
    setFormTone(companyProfile?.toneOfVoice || "");
    setFormWebsite(companyProfile?.website || "");
    setOnboardingStep(1);
    setShowOnboarding(true);
  };

  // Save profile helper
  const saveCompanyProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formName.trim() || !formDesc.trim() || !formIndustry.trim() || !formAudience.trim()) {
      alert("Please fill in all the required fields.");
      return;
    }
    const profile: CompanyProfile = {
      companyName: formName.trim(),
      productDescription: formDesc.trim(),
      targetAudience: formAudience.trim(),
      industry: formIndustry.trim(),
      toneOfVoice: formTone.trim() || "Professional, Actionable",
      website: formWebsite.trim()
    };
    setCompanyProfile(profile);
    localStorage.setItem("content_engine_company_profile", JSON.stringify(profile));
    setShowOnboarding(false);
  };

  // Skip onboarding with loaded pre-fill sample profile
  const loadSampleProfile = () => {
    setFormName("HyperSaaS Pro");
    setFormDesc("A real-time marketing analytics workspace that lets solopreneurs and SaaS builders auto-repurpose content and track campaign channels in minutes.");
    setFormIndustry("Marketing Tech / B2B SaaS");
    setFormAudience("Indie Hackers, SaaS Founders, Content Creators");
    setFormTone("Actionable, Transparent, Bold, Analytical");
    setFormWebsite("https://hypersaas.io");
    setOnboardingStep(3); // advance directly to confirmation review step
  };

  // Helper selectors from helper modals to draft notes
  const handleSelectPrompt = (promptText: string) => {
    setTextNotes(promptText);
    setSourceType("text");
    setShowDocsModal(false);
  };

  const handleSelectTemplate = (templateText: string) => {
    setTextNotes(templateText);
    setSourceType("text");
    setShowTemplatesModal(false);
  };

  // Load history from local storage on component render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("content_engine_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save history helper
  const saveHistoryList = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("content_engine_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // Add custom tone tag
  const addToneWord = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = toneInput.trim().replace(/,/g, "");
      if (val && !toneKeywords.includes(val)) {
        setToneKeywords([...toneKeywords, val]);
      }
      setToneInput("");
    }
  };

  const removeToneWord = (word: string) => {
    setToneKeywords(toneKeywords.filter(w => w !== word));
  };

  // Automated Scraper action
  const handleScrape = async () => {
    if (!urlInput.trim()) {
      setErrorMessage("Please supply a valid URL to scrape content from.");
      return;
    }
    setErrorMessage(null);
    setIsScraping(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve text content.");
      }

      setTextNotes(data.text);
      setSourceType("text"); // Switch focus to editable content
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to read URL. Please copy-paste the text content directly instead.");
    } finally {
      setIsScraping(false);
    }
  };

  // Primary Platform post Generator trigger
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const sourceContent = textNotes.trim();
    if (!sourceContent) {
      setErrorMessage("Please input source text notes or scrape a URL before kicking off AI generation.");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: sourceContent,
          sourceType,
          style: selectedStyle,
          audience: selectedAudience,
          toneKeywords,
          companyDetails: companyProfile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate optimized copies.");
      }

      setGeneratedResult(data);

      // Save into history automatically
      const newHistoryItem: HistoryItem = {
        id: "hist_" + Date.now(),
        title: sourceType === "url" && urlInput ? urlInput.replace(/^https?:\/\/(www\.)?/, "").substring(0, 30) : sourceContent.substring(0, 35) + "...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceText: sourceContent,
        sourceType,
        scrapedUrl: sourceType === "url" ? urlInput : undefined,
        style: selectedStyle,
        audience: selectedAudience,
        toneKeywords,
        generated: data,
        isFavorite: false
      };

      saveHistoryList([newHistoryItem, ...history.slice(0, 24)]);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during Gemini translation.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle refinement updates for specific platforms
  const handleRefineSnippet = async (platform: keyof GeneratedPackage["posts"], prompt: string) => {
    if (!generatedResult) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const currentPost = generatedResult.posts[platform];
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          currentContent: currentPost.content,
          refinePrompt: prompt,
          originalSource: textNotes,
          companyDetails: companyProfile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to refine this platform post.");
      }

      // Update local state copy
      const updatedPosts = {
        ...generatedResult.posts,
        [platform]: {
          ...currentPost,
          ...data
        }
      };

      setGeneratedResult({
        ...generatedResult,
        posts: updatedPosts
      });
    } catch (err: any) {
      setErrorMessage(`Refinement error: ${err.message}`);
    } finally {
      setIsRefining(false);
    }
  };

  // Quick select a sample configuration data to kick-off demo instantly
  const loadQuickSample = (idx: number) => {
    const sample = SAMPLE_SOURCES[idx];
    setSourceType(sample.type);
    if (sample.type === "url") {
      setUrlInput(sample.url || "");
    }
    setTextNotes(sample.text);
    setSelectedStyle(sample.style);
    setSelectedAudience(sample.audience);
    setToneKeywords(sample.tones);
    setErrorMessage(null);
  };

  // Restore state from past history record
  const restoreHistory = (item: HistoryItem) => {
    setSourceType(item.sourceType);
    if (item.scrapedUrl) {
      setUrlInput(item.scrapedUrl);
    }
    setTextNotes(item.sourceText);
    setSelectedStyle(item.style);
    setSelectedAudience(item.audience);
    setToneKeywords(item.toneKeywords || []);
    setGeneratedResult(item.generated);
    setErrorMessage(null);
  };

  // Favorites toggle callback
  const toggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.map(h => h.id === id ? { ...h, isFavorite: !h.isFavorite } : h);
    saveHistoryList(updated);
  };

  // Delete past history item
  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    saveHistoryList(updated);
  };

  // Clear history database list
  const clearAllHistory = () => {
    if (window.confirm("Do you want to wipe out your content generation histories?")) {
      saveHistoryList([]);
    }
  };

  // Simulated direct scheduler publisher status
  const executeBulkPostDemo = () => {
    setIsBulkPostingDemo(true);
    setTimeout(() => {
      setIsBulkPostingDemo(false);
      setBulkPostSuccess(true);
      setTimeout(() => setBulkPostSuccess(false), 4000);
    }, 2200);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden">
      
      {/* Header Navigation */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg select-none shadow-md font-display">
            C
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-1.5 font-display">
              CONTENT <span className="text-indigo-600 font-extrabold">ENGINE</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-widest leading-none">STARTUP SOCIAL SUITE</p>
          </div>
          <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded uppercase tracking-wider">v2.5 Pro</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-500 font-display">
          <span 
            onClick={() => { setShowTemplatesModal(false); setShowCampaignsModal(false); }}
            className="text-indigo-600 border-b-2 border-indigo-600 px-1 py-1 cursor-pointer"
          >
            AI Post Generator
          </span>
          <span 
            onClick={() => setShowTemplatesModal(true)}
            className="text-slate-400 hover:text-indigo-600 px-1 py-1 cursor-pointer transition flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            Viral Templates
          </span>
          <span 
            onClick={() => setShowCampaignsModal(true)}
            className="text-slate-400 hover:text-indigo-600 px-1 py-1 cursor-pointer transition flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            Campaign Tracks
          </span>
        </nav>

        <div className="flex items-center gap-3.5 pl-4 border-l border-slate-200">
          <button 
            onClick={openCompanyProfileEdit}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 text-xs font-black rounded-lg transition shadow-xs cursor-pointer"
            title="Update Company Details"
          >
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span>{companyProfile ? companyProfile.companyName : "Setup Profile"}</span>
          </button>

          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">Product Builder</p>
            <p className="text-xs text-slate-400 font-medium font-mono">sndpdesign@gmail.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-sm select-none shadow-sm">
            PB
          </div>
        </div>
      </header>

      {/* Main Container Workspace layout */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Sidepanel: Dense UI Controls & History Scrollbar */}
        <aside className="w-[410px] bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-0">
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* 1. Quick Sandbox Samples */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 font-display">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Quick Playground Tests
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Click to load demo</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_SOURCES.map((sam, i) => (
                  <button
                    key={i}
                    onClick={() => loadQuickSample(i)}
                    className="px-2.5 py-2 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold text-left truncate transition shadow-xs hover:border-indigo-200"
                    title={sam.title}
                  >
                    {sam.title}
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR CARD */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Execution Error</p>
                  <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 2. Source Content Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">
                  1. Source Content
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setSourceType("text")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                      sourceType === "text" 
                        ? "bg-white text-slate-800 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Draft Notes
                  </button>
                  <button
                    onClick={() => setSourceType("url")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                      sourceType === "url" 
                        ? "bg-white text-slate-800 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    URL Scrape
                  </button>
                </div>
              </div>

              {sourceType === "url" ? (
                <div className="space-y-2">
                  <div className="flex gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="https://news.ycombinator.com/item?id=..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium pr-8"
                      />
                      <Globe className="absolute right-2.5 top-3 w-4 h-4 text-slate-400" />
                    </div>
                    <button
                      type="button"
                      onClick={handleScrape}
                      disabled={isScraping || !urlInput.trim()}
                      className="px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm flex items-center gap-1.5 transition select-none disabled:opacity-40"
                    >
                      {isScraping ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Fetch"
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-tight">
                    Scrapes structural visual text, blog notes, or web articles instantly without clutter.
                  </p>
                </div>
              ) : null}

              <div className="relative">
                <textarea
                  value={textNotes}
                  onChange={(e) => setTextNotes(e.target.value)}
                  placeholder="Paste startup metrics, raw features roadmap, LinkedIn posts to repurpose, blog drafts, or transcript notes..."
                  className="w-full h-42 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-medium resize-none leading-relaxed"
                />
                <div className="absolute right-3 bottom-2 text-xs text-slate-400 font-mono font-medium">
                  {textNotes.length} chars | {textNotes.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            </div>

            {/* 3. Settings Accordion parameters */}
            <div className="border border-slate-100 rounded-xl p-4.5 space-y-4 bg-slate-50/60">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-display">
                2. AI Optimization Settings
              </span>

              {/* Style Grid */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-semibold block">Writing Angle / Custom Hook</span>
                <div className="grid grid-cols-2 gap-2">
                  {HOOK_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2.5 rounded-lg border text-left transition ${
                        selectedStyle === style.id
                          ? "bg-indigo-50 border-indigo-200 text-indigo-950 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                      title={style.description}
                    >
                      <p className="text-xs font-semibold truncate">{style.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Dropdown */}
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Target Persona</span>
                  <select
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {TARGET_AUDIENCES.map((aud) => (
                      <option key={aud.id} value={aud.id}>
                        {aud.name} ({aud.subtitle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Tone Words list */}
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-semibold block">Tone Qualities (Press Enter to add)</span>
                <div className="flex flex-wrap gap-1.5 mb-1.5 min-h-[26px]">
                  {toneKeywords.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[11px] font-bold rounded flex items-center gap-1.5 select-none animate-fadeIn"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => removeToneWord(tag)}
                        className="hover:text-red-600 text-slate-500 text-[11px] font-extrabold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {toneKeywords.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No custom tone set</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. bold, analytical, curious..."
                  value={toneInput}
                  onChange={(e) => setToneInput(e.target.value)}
                  onKeyDown={addToneWord}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !textNotes.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 select-none font-display uppercase tracking-widest cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Generating Posts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate All Platforms
                </>
              )}
            </button>

          </div>

          {/* Bottom segment: Gen history library list */}
          <div className="h-[240px] border-t border-slate-200 flex flex-col bg-slate-50">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <Clock className="w-4 h-4 text-indigo-500" />
                Saved &amp; Recent Builds ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="text-xs font-bold text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {history.map((record) => (
                <div
                  key={record.id}
                  onClick={() => restoreHistory(record)}
                  className={`p-2.5 bg-white rounded-lg border text-left cursor-pointer transition select-none flex items-start gap-2.5 group hover:border-indigo-300 ${
                    generatedResult?.sourceSummary === record.generated.sourceSummary
                      ? "border-indigo-400 bg-indigo-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 mt-0.5 flex-shrink-0 transition ${
                    record.isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-300 group-hover:text-slate-400"
                  }`} onClick={(e) => toggleFav(e, record.id)} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-sm font-bold text-slate-700 truncate leading-tight">
                        {record.title}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap font-mono">{record.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                        {record.style}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600">
                        {record.audience.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => deleteHistoryItem(e, record.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded text-xs select-none opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 text-slate-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Histories empty</p>
                  <p className="text-[11px] text-slate-400 max-w-[220px]">Generated startup runs will appear here for one-click reload.</p>
                </div>
              )}
            </div>
          </div>

        </aside>

        {/* Right Pane: Generated Feed Grid with Platform Switcher */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
          
          {generatedResult ? (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Core Topic Executive Summaries Card */}
              <div className="m-4 mb-2 p-5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    <Layers className="w-5.5 h-5.5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">
                        Gemini Executive Core Topic Summary
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-600 font-semibold select-text line-clamp-2 mt-1 leading-relaxed">
                      "{generatedResult.sourceSummary}"
                    </p>
                  </div>
                </div>

                {/* Bulk Publisher Scheduler Widget */}
                <div className="border-l border-slate-200 pl-5 flex-shrink-0 flex items-center gap-4">
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">Bulk Scheduler Mode</p>
                    <p className="text-xs text-slate-400 font-mono">Sync all generated platforms immediately</p>
                  </div>
                  
                  {bulkPostSuccess ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-bold animate-pulse">
                      <Check className="w-4 h-4" />
                      Social Feeds Synced!
                    </div>
                  ) : (
                    <button
                      onClick={executeBulkPostDemo}
                      disabled={isBulkPostingDemo}
                      className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer select-none"
                    >
                      {isBulkPostingDemo ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin font-bold text-white" />
                          Scheduling...
                        </>
                      ) : (
                        "Bulk Deploy All"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Responsive dense multi-column platform mockup layout */}
              <div className="flex-1 p-4 pt-0 overflow-y-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  
                  {/* LinkedIn post */}
                  <VisualMockup
                    platform="linkedin"
                    data={generatedResult.posts.linkedin}
                    onRefine={(prompt) => handleRefineSnippet("linkedin", prompt)}
                    isRefining={isRefining}
                  />

                  {/* X / Twitter post */}
                  <VisualMockup
                    platform="x"
                    data={generatedResult.posts.x}
                    onRefine={(prompt) => handleRefineSnippet("x", prompt)}
                    isRefining={isRefining}
                  />



                  {/* Instagram Visuals carousel guide post */}
                  <VisualMockup
                    platform="instagram"
                    data={generatedResult.posts.instagram}
                    onRefine={(prompt) => handleRefineSnippet("instagram", prompt)}
                    isRefining={isRefining}
                  />

                  {/* Reddit Post Thread */}
                  <div className="xl:col-span-2">
                    <VisualMockup
                      platform="reddit"
                      data={generatedResult.posts.reddit}
                      onRefine={(prompt) => handleRefineSnippet("reddit", prompt)}
                      isRefining={isRefining}
                    />
                  </div>

                </div>
              </div>

            </div>
          ) : (
            // Elegant Empty state placeholder featuring simple guidelines
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none max-w-3xl mx-auto">
              
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-center shadow-md mb-5 select-none animate-bounce">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-800 font-display">
                Welcome to Content Engine Pro
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-lg font-medium">
                An unified AI-powered social workspace built specifically for startup founders, builders, and solopreneurs to dominate multi-channel presence in minutes.
              </p>

              {/* Explanatory flow timeline steps */}
              <div className="grid grid-cols-3 gap-5 w-full mt-10 max-w-2xl">
                <div className="bg-white border border-slate-200 p-4.5 rounded-xl flex flex-col items-center text-center shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center mb-2.5 font-display">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 animate-pulse">Supply Context</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Paste metrics, product roadmaps, rough thoughts, or paste a blog URL link.</p>
                </div>

                <div className="bg-white border border-slate-200 p-4.5 rounded-xl flex flex-col items-center text-center shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center mb-2.5 font-display">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 animate-pulse">Fine-tune Angles</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Choose story styles, metric-heavy outlines, or target developer audiences.</p>
                </div>

                <div className="bg-white border border-slate-200 p-4.5 rounded-xl flex flex-col items-center text-center shadow-xs">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center mb-2.5 font-display">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 animate-pulse">Refine &amp; Ship</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Instantly get LinkedIn, Twitter, Reddit &amp; more formatted copy to deploy!</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs font-semibold text-slate-400">Not sure where to start? Load a sample below:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => loadQuickSample(0)}
                    className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-100 transition"
                  >
                    Load Investor Report
                  </button>
                  <button
                    onClick={() => loadQuickSample(1)}
                    className="px-4.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold transition"
                  >
                    Load Solopreneur Build-in-Public Notes
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer Status Bar with clean alignment */}
      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs font-medium text-slate-400 shrink-0 select-none z-10 font-mono">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Gemini 1.5 &amp; 3.5 AI Core Live</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span>•</span>
            <span>Character Limit Checks Active</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span>•</span>
            <span>Local Storage History Cache OK</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <span>Active Client Session: <span className="text-slate-700 font-semibold text-xs">{companyProfile ? companyProfile.companyName : "Startup Founder"}</span></span>
          <span className="text-slate-200">|</span>
          <button 
            onClick={() => setShowDocsModal(true)}
            className="text-indigo-600 hover:underline flex items-center gap-1 text-xs font-bold cursor-pointer bg-transparent border-none"
          >
            Docs &amp; Prompts <ExternalLink className="w-3.5 h-3.5 inline" id="docLinkIcon" />
          </button>
        </div>
      </footer>

      {/* ==================== ONBOARDING SCREENS / COMPANY DETAILS MODAL ==================== */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5.5 text-white flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Startup Profiler</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">Onboard Your Company</h3>
                <p className="text-xs text-indigo-100 mt-1">Configure your brand details once. We will automatically custom-tailor all future AI social generations for your product!</p>
              </div>
              {companyProfile && (
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Stepper Progress Indicator */}
            <div className="px-6 pt-5 pb-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 select-none">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${onboardingStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>1</span>
                  <span className={onboardingStep === 1 ? "text-slate-800" : ""}>Essentials</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${onboardingStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>2</span>
                  <span className={onboardingStep === 2 ? "text-slate-800" : ""}>Vision &amp; Persona</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${onboardingStep >= 3 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>3</span>
                  <span className={onboardingStep === 3 ? "text-slate-800" : ""}>Brand Voice</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {onboardingStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2.5 text-xs text-slate-500 mb-2 font-medium">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p>Enter your core brand metadata. This enables the writing model to mention your website and product tag naturally in drafts.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Company or Product Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. AcmeSaaS Pro"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Industry or Niche Sector <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formIndustry}
                      onChange={(e) => setFormIndustry(e.target.value)}
                      placeholder="e.g. Creator Economy / B2B AI Tooling"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Company Website URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input 
                      type="url" 
                      value={formWebsite}
                      onChange={(e) => setFormWebsite(e.target.value)}
                      placeholder="https://acmesaas.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={loadSampleProfile}
                      className="text-xs text-indigo-600 font-extrabold hover:underline"
                    >
                      ⚡ Shortcut: Load Sample Demo Data
                    </button>
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">What does it do? (Product Description) <span className="text-rose-500">*</span></label>
                    <textarea 
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={3}
                      placeholder="e.g. A developer-first continuous integration service that runs test pipelines 10x faster using predictive asset caching."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 leading-relaxed resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Customer / Core Audience Persona <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formAudience}
                      onChange={(e) => setFormAudience(e.target.value)}
                      placeholder="e.g. Solopreneurs, CTOs, Indie Hackers, Content creators"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Brand Tone &amp; Style Keywords <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formTone}
                      onChange={(e) => setFormTone(e.target.value)}
                      placeholder="e.g. Witty, Bold, Analytical, Build-In-Public, Technical"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
                      required
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Helpful keywords are: contrarian, authentic, lesson-heavy, concise, energetic.</span>
                  </div>

                  <div className="mt-4 p-4.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" /> Ready to Dominate Socials!
                    </h4>
                    <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                      Your profile will save locally. When you feed any bullet points or URL notes to the engine, it automatically shapes the text matching **{formName || "your company"}** rules.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                {onboardingStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="flex items-center gap-1 text-xs font-black text-slate-600 hover:text-slate-800 px-3 py-2 border border-slate-300 rounded-lg transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {!companyProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      // Skip and use dummy data
                      setFormName("Solopreneur Build");
                      setFormDesc("A personal micro-SaaS framework building tools for modern content creation.");
                      setFormIndustry("Indie Software / Media Tech");
                      setFormAudience("Indie Hackers, SaaS creators");
                      setFormTone("Crisp, Build-In-Public, high-tempo");
                      setFormWebsite("https://indiebuild.co");
                      setTimeout(() => {
                        const profile: CompanyProfile = {
                          companyName: "Solopreneur Build",
                          productDescription: "A personal micro-SaaS framework building tools for modern content creation.",
                          targetAudience: "Indie Hackers, SaaS creators",
                          industry: "Indie Software / Media Tech",
                          toneOfVoice: "Crisp, Build-In-Public, high-tempo",
                          website: "https://indiebuild.co"
                        };
                        setCompanyProfile(profile);
                        localStorage.setItem("content_engine_company_profile", JSON.stringify(profile));
                        setShowOnboarding(false);
                      }, 100);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 text-xs font-bold rounded-lg transition"
                  >
                    Skip &amp; Use Sandbox
                  </button>
                )}

                {onboardingStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onboardingStep === 1 && (!formName.trim() || !formIndustry.trim())) {
                        alert("Please fill in the required details.");
                        return;
                      }
                      setOnboardingStep(onboardingStep + 1);
                    }}
                    className="flex items-center gap-1 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-lg transition shadow-md shadow-indigo-100 cursor-pointer"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => saveCompanyProfile()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-lg transition shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Save &amp; Activate Profile
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== HELPER DOCS & PROMPTS LIBRARY MODAL ==================== */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in duration-200">
            
            <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-extrabold font-display">Docs &amp; Playbooks Library</h3>
              </div>
              <button 
                onClick={() => setShowDocsModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-slate-700 text-sm leading-relaxed">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Optimizing Context Strategy
                </h4>
                <p className="text-xs text-slate-500">
                  Social media platforms reward focus. Instead of dumping a complete 4,000-word blog post or entire pitch deck, paste single sections, specific metrics, or product launch lists inside our <strong>Draft Notes</strong> box.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-extrabold text-slate-900 text-base mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Quick Copy Founder Prompts
                </h4>
                <p className="text-xs text-slate-400 mb-3 font-medium">Click any blueprint prompt to pre-fill the input notes automatically!</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleSelectPrompt("Acme DevTools just crossed $15,000 MRR today. Core statistics: 10,200 developers onboard, average CI build speeds decreased from 12 minutes to 85 seconds. Our core engine is written in Rust. We grew purely through SEO and sharing educational tools on Reddit and Hacker News. Major lesson learned: focus on speed first and pricing second.")}
                    className="text-left p-3 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer"
                  >
                    <span className="font-bold text-xs text-indigo-600 block mb-1">🚀 $15k MRR Milestone</span>
                    <p className="text-[11px] text-slate-500 line-clamp-2">How we reached $15k MRR, SEO, speed benchmarks and CI tools.</p>
                  </button>

                  <button 
                    onClick={() => handleSelectPrompt("We made the difficult choice to drop our free tier entirely. Results over the last 30 days: server database usage fell by 60%, customer support tickets dropped by 80%, but our daily trial-to-paid conversion rate doubled! Our premium plan is $29/mo. Lesson: free users cost the most customer support time while paying users give actionable feedback.")}
                    className="text-left p-3 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer"
                  >
                    <span className="font-bold text-xs text-indigo-600 block mb-1">💡 dropping Free Tier Lesson</span>
                    <p className="text-[11px] text-slate-500 line-clamp-2">The hard metrics and changes from deprecating our free product tier.</p>
                  </button>

                  <button 
                    onClick={() => handleSelectPrompt("Product update release notes v2.0: Added interactive canvas flowcharts, unified workspaces, local storage auto-save. Our goal is to save startup builders 8 hours per week. Try it out on our website.")}
                    className="text-left p-3 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer"
                  >
                    <span className="font-bold text-xs text-indigo-600 block mb-1">📦 Product Update Draft</span>
                    <p className="text-[11px] text-slate-500 line-clamp-2">Feature launch outline including saved times, canvas tool, auto-saves.</p>
                  </button>

                  <button 
                    onClick={() => handleSelectPrompt("Why we migrated away from multi-cloud back to a single VPS on Hetzner: saved $1,200/mo, network latency fell by 20ms, deployment configurations decreased from 400 lines of YAML to 12. Multi-cloud is over-engineered for 95% of startups.")}
                    className="text-left p-3 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer"
                  >
                    <span className="font-bold text-xs text-indigo-600 block mb-1">⚙️ Architecture Migration</span>
                    <p className="text-[11px] text-slate-500 line-clamp-2">Contrarian technical piece regarding cloud bills and server hosting costs.</p>
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-extrabold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-500" />
                  Writing Formulas Applied
                </h4>
                <div className="bg-slate-50 rounded-xl p-4.5 text-xs text-slate-600 space-y-2">
                  <p>Our underlying Gemini models use the following frameworks to optimize copy:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Hook/Problem-Agitate-Solve (PAS)</strong>: Grabs instant attention with a bold statement or metrics on LinkedIn &amp; Twitter.</li>
                    <li><strong>Markdown Readability</strong>: Strict spacing rules to guarantee copy is eye-safe and highly readable on mobile screens.</li>
                    <li><strong>Value-First Reddit Rule</strong>: Strips sales words or marketing slogans. Provides raw code examples, transparent charts, or lessons.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button 
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Close Library
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE VIRAL TEMPLATES MODAL ==================== */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in duration-200">
            
            <div className="bg-indigo-900 px-6 py-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-300" />
                <h3 className="text-lg font-extrabold font-display">Viral Framework Templates</h3>
              </div>
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-500 font-semibold mb-2">Select a high-converting formula structure. This will pre-fill your Draft Notes canvas so you can fill in your metrics and generate!</p>
              
              <div className="space-y-3.5">
                {/* Template 1 */}
                <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition flex flex-col justify-between items-start gap-3">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">Template 1: The Build-In-Public Milestone</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black font-mono">HIGH ENGAGEMENT</span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mb-2">Great for sharing revenue peaks, launch days, or specific tech migrations.</p>
                    <pre className="bg-slate-50 border border-slate-200 text-[11px] text-slate-500 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
{`We just hit [Milestone/Revenue] today.
Here are the exact 3 metrics we tracked to get here:
1. [Metric A] - [Details]
2. [Metric B] - [Details]
3. [Metric C] - [Details]

The biggest contrarian lesson we learned along the way: [Lesson]`}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(
`We just hit $15k MRR today.
Here are the exact 3 metrics we tracked to get here:
1. Product active users grew to 12,000 weekly active developers.
2. Server hosting bills reduced to $80/month using efficient cloud instances.
3. Churn dropped to 1.5% by offering 24/7 technical chat support.

The biggest contrarian lesson we learned along the way: do not try to build every requested feature. Say no to 90% of requests to keep the product simple and lightning fast.`
                    )}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg transition self-end cursor-pointer"
                  >
                    Use This Template Structure
                  </button>
                </div>

                {/* Template 2 */}
                <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition flex flex-col justify-between items-start gap-3">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Template 2: The Contrarian Failure Lesson</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black font-mono">EDUCATIONAL</span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mb-2">Perfect for breaking down why an industry-standard method failed for you.</p>
                    <pre className="bg-slate-50 border border-slate-200 text-[11px] text-slate-500 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
{`Everyone in SaaS says [Standard Advice].
We did the exact opposite for the last 30 days.
Here is what happened to our metrics:
- [Change 1]
- [Change 2]

If you're a founder, don't blindly follow common playbooks. Do this instead: [Advice]`}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(
`Everyone in SaaS says you must offer a free trial to scale.
We did the exact opposite for the last 30 days and put up a strict credit card wall.
Here is what happened to our metrics:
- Customer support requests dropped by 75% instantly.
- Paid trial-to-paying conversion rates doubled.
- Server database compute bills reduced by 50% as spam users vanished.

If you're a founder, don't blindly follow common playbooks. Charge for your product from day one to filter out non-ideal users.`
                    )}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg transition self-end cursor-pointer"
                  >
                    Use This Template Structure
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Close Templates
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== CAMPAIGN TRACKS CHECKLIST MODAL ==================== */}
      {showCampaignsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in duration-200">
            
            <div className="bg-slate-800 px-6 py-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-extrabold font-display">Campaign Tracks Planner</h3>
              </div>
              <button 
                onClick={() => setShowCampaignsModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 leading-relaxed font-medium">
                <strong>💡 Campaign tracks are structured checklists.</strong> They help solopreneurs and indie builders structure their daily/weekly social posting campaigns so they never run out of ideas. Check items off as you write and ship posts!
              </div>

              {/* Track A */}
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                  🚀 Track 1: The MVP Launch Blitz (Day 1 - 5)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/50 rounded-lg transition">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <strong className="text-slate-800">Day 1: The Birth of the Idea</strong>
                      <p className="text-slate-500 mt-0.5 text-[11px]">Write about what problem inspired you to start building. Keep it raw and transparent.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/50 rounded-lg transition">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <strong className="text-slate-800">Day 2: The Core Tech Stack</strong>
                      <p className="text-slate-500 mt-0.5 text-[11px]">Explain why you chose your specific database, language, or framework. Highlight simplicity.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/50 rounded-lg transition">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <strong className="text-slate-800">Day 3: The MVP Showcase</strong>
                      <p className="text-slate-500 mt-0.5 text-[11px]">Share an image design layout or slide suggestion explaining exactly how the beta tool operates.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Track B */}
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                  📈 Track 2: The Weekly Traction Pulse (Ongoing)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/50 rounded-lg transition">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <strong className="text-slate-800">The Metric Milestone</strong>
                      <p className="text-slate-500 mt-0.5 text-[11px]">Post any milestone metrics, revenue graphs, support ticks decrease, or performance speedups.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/50 rounded-lg transition">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <div>
                      <strong className="text-slate-800">The Hard Customer Feedback Lesson</strong>
                      <p className="text-slate-500 mt-0.5 text-[11px]">Explain what a customer asked for, how it forced you to change course, and what you learned.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button 
                onClick={() => setShowCampaignsModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Close Track Planner
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
