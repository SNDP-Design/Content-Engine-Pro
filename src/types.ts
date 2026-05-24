export interface ChannelPost {
  content: string;
  hook?: string;
  hashtags?: string[];
  visualSuggestion?: string; // only for Instagram
  subredditSuggestion?: string; // only for Reddit
  title?: string; // only for Reddit
  characterCount: number;
}

export interface GeneratedPosts {
  linkedin: ChannelPost;
  x: ChannelPost;
  threads: ChannelPost;
  instagram: ChannelPost;
  reddit: ChannelPost;
}

export interface GeneratedPackage {
  sourceSummary: string;
  posts: GeneratedPosts;
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  sourceText: string;
  sourceType: "url" | "text";
  scrapedUrl?: string;
  style: string;
  audience: string;
  toneKeywords: string[];
  generated: GeneratedPackage;
  isFavorite?: boolean;
}

export const HOOK_STYLES = [
  {
    id: "Thought Leadership",
    name: "Thought Leadership",
    description: "Visionary trends, actionable frameworks, and crisp authority.",
    icon: "Award"
  },
  {
    id: "Boldly Transparent",
    name: "Boldly Transparent",
    description: "Raw numbers, mistakes made, and building in public lessons.",
    icon: "Eye"
  },
  {
    id: "Metric-Heavy",
    name: "Metric-Heavy",
    description: "Traction percentages, funnel performance, and before/after stats.",
    icon: "TrendingUp"
  },
  {
    id: "Storytelling",
    name: "Storytelling",
    description: "A narrative journey starting with the problem, conflict, and solution.",
    icon: "BookOpen"
  },
  {
    id: "Controversial / Op-Ed",
    name: "Controversial / Op-Ed",
    description: "An unexpected contrarian take backed by strong execution reasons.",
    icon: "Flame"
  },
  {
    id: "Humorous / Sarcastic",
    name: "Humorous / Sarcastic",
    description: "Witty, tongue-in-cheek style, highly suitable for X/Twitter and Reddit.",
    icon: "Laugh"
  }
];

export const TARGET_AUDIENCES = [
  { id: "VCs & Investors", name: "VCs & Investors", subtitle: "Focus on ROI, scale, TAM" },
  { id: "Tech Founders & SaaS creators", name: "Founders & SaaS Creators", subtitle: "Focus on build speed, growth" },
  { id: "Indie Hackers & Builders", name: "Indie Hackers", subtitle: "Focus on bootstrapping, MVP" },
  { id: "Software Engineers", name: "Software Engineers", subtitle: "Focus on technical architecture" },
  { id: "General Tech Public / Users", name: "General Tech Public", subtitle: "Focus on friendly solutions" }
];
