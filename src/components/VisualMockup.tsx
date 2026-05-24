import React, { useState } from "react";
import { 
  Heart, MessageSquare, Repeat, Share2, Award, 
  ThumbsUp, MessageCircle, ArrowUp, ArrowDown,
  Copy, Check, Sparkles, Send, RefreshCw, Eye
} from "lucide-react";
import { ChannelPost } from "../types";

interface VisualMockupProps {
  platform: "linkedin" | "x" | "threads" | "instagram" | "reddit";
  data: ChannelPost;
  userName?: string;
  userEmail?: string;
  onRefine: (refinePrompt: string) => Promise<void>;
  isRefining: boolean;
}

export default function VisualMockup({
  platform,
  data,
  userName = "Startup Founder",
  userEmail = "founder@contentengine.ai",
  onRefine,
  isRefining
}: VisualMockupProps) {
  const [copied, setCopied] = useState(false);
  const [refineText, setRefineText] = useState("");
  const [showRefinePanel, setShowRefinePanel] = useState(false);

  const handleCopy = async () => {
    try {
      let textToCopy = data.content;
      if (platform === "reddit") {
        textToCopy = `${data.title || "Untitled Post"}\n\n${data.content}`;
      } else if (platform === "instagram") {
        textToCopy = `${data.content}\n\n[Visual/Slide Suggestion]:\n${data.visualSuggestion}`;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy:", err);
    }
  };

  const submitRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim()) return;
    await onRefine(refineText);
    setRefineText("");
    setShowRefinePanel(false);
  };

  // Human initials for user default profile
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SF";
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Platform Header Panel */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${
            platform === "linkedin" ? "bg-blue-600" :
            platform === "x" ? "bg-slate-900" :
            platform === "threads" ? "bg-zinc-800" :
            platform === "instagram" ? "bg-pink-600" : "bg-orange-600"
          }`} />
          <h4 className="text-xs font-bold tracking-tight text-slate-800 uppercase font-display">
            {platform === "x" ? "X / Twitter" : platform}
          </h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowRefinePanel(!showRefinePanel)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-slate-150 rounded-lg transition"
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Refine
          </button>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition ${
              copied 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-slate-150 text-slate-600 hover:text-slate-800 hover:bg-slate-200/80"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Refinement Inputs Overlay Panel */}
      {showRefinePanel && (
        <form onSubmit={submitRefine} className="p-3 bg-slate-50/90 border-b border-slate-200 animate-slideDown">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-slate-500">
              Provide feedback or custom rewrite prompt for this post:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 'make it simpler', 'add call to action to sign up', 'make the hook sound more punchy'"
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                disabled={isRefining}
                autoFocus
              />
              <button
                type="submit"
                disabled={isRefining || !refineText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition disabled:opacity-50"
              >
                {isRefining ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                Apply
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Realistic Platform Mockups */}
      <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-slate-900/40">
        
        {/* 1. LINKEDIN PREVIEW MOCKUP */}
        {platform === "linkedin" && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-lg mx-auto shadow-md">
            {/* User Profile Info Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner select-none font-display">
                {getInitials(userName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm hover:underline hover:text-blue-400 cursor-pointer text-slate-100 truncate">
                    {userName}
                  </span>
                  <span className="text-[11px] text-slate-400">• 1st</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Founder &amp; Builder of SaaS • Building Content Engine</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <span>1h ago</span>
                  <span>•</span>
                  <Award className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-[13.5px] text-slate-200 leading-relaxed whitespace-pre-wrap select-text mb-4">
              {data.content}
            </div>

            {/* Footer Metrics Mock */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp className="w-3 h-3 text-blue-400 fill-blue-400" />
                  <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                </span>
                <span>42 likes • 5 comments</span>
              </div>
              <div>
                <span>3 reposts</span>
              </div>
            </div>

            {/* Action Bar Mock */}
            <div className="grid grid-cols-4 gap-1 text-[11.5px] text-slate-400 font-semibold pt-0.5">
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-900 rounded transition cursor-not-allowed">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-900 rounded transition cursor-not-allowed">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-900 rounded transition cursor-not-allowed">
                <Repeat className="w-4 h-4" />
                <span>Repost</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-900 rounded transition cursor-not-allowed">
                <Share2 className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. X / TWITTER PREVIEW MOCKUP */}
        {platform === "x" && (
          <div className="bg-black border border-zinc-800 rounded-xl p-4 max-w-lg mx-auto shadow-md text-white font-sans">
            {/* Header info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 shadow font-display">
                  {getInitials(userName)}
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm tracking-tight text-zinc-100 hover:underline cursor-pointer">
                      {userName}
                    </span>
                    <span className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                  </div>
                  <span className="text-xs text-zinc-500">@{userName.toLowerCase().replace(/\s/g, "")}</span>
                </div>
              </div>
              <span className="text-zinc-600 text-sm font-bold font-display cursor-not-allowed">X</span>
            </div>

            {/* Body Text */}
            <div className="text-[14.5px] leading-normal text-zinc-100 whitespace-pre-wrap select-text mb-4 mt-2">
              {data.content}
            </div>

            {/* Timings */}
            <div className="text-xs text-zinc-500 border-b border-zinc-800 pb-3 mb-3">
              <span>9:58 AM · May 24, 2026</span>
              <span className="mx-1.5">·</span>
              <span className="font-semibold text-zinc-300">11.4K</span>
              <span className="text-zinc-500"> Views</span>
            </div>

            {/* Interactions Bar */}
            <div className="flex justify-between text-zinc-500 text-xs px-2 pt-0.5">
              <button className="flex items-center gap-1.5 hover:text-sky-400 transition cursor-not-allowed">
                <MessageCircle className="w-4 h-4" />
                <span>12</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-emerald-400 transition cursor-not-allowed">
                <Repeat className="w-4 h-4" />
                <span>28</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-pink-500 transition cursor-not-allowed">
                <Heart className="w-4 h-4" />
                <span>184</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-sky-400 transition cursor-not-allowed">
                <Share2 className="w-4 h-4" />
                <span>5</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. THREADS PREVIEW MOCKUP */}
        {platform === "threads" && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-w-lg mx-auto shadow-md text-zinc-100">
            <div className="flex items-start gap-3">
              {/* Profile image with connection rail */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-zinc-200 font-display shadow">
                  {getInitials(userName)}
                </div>
                <div className="w-0.5 flex-1 bg-zinc-800 my-2 rounded-full min-h-[40px]" />
                <div className="relative flex items-center">
                  <div className="w-4 h-4 rounded-full bg-zinc-700 border-2 border-zinc-950 flex items-center justify-center">
                    <Heart className="w-2 h-2 text-zinc-200 fill-zinc-200" />
                  </div>
                </div>
              </div>

              {/* Feed logic */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm hover:underline cursor-pointer">{userName.toLowerCase().replace(/\s/g, "_")}</span>
                    <span className="text-zinc-500 text-xs">2h</span>
                  </div>
                  <button className="text-zinc-500 hover:text-white transition">•••</button>
                </div>

                <div className="text-[13.5px] leading-relaxed text-zinc-200 whitespace-pre-wrap select-text mb-4">
                  {data.content}
                </div>

                {/* Engagement icons */}
                <div className="flex items-center gap-4 text-zinc-400 mb-2">
                  <button className="hover:text-pink-500 transition cursor-not-allowed">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="hover:text-zinc-200 transition cursor-not-allowed">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="hover:text-emerald-500 transition cursor-not-allowed">
                    <Repeat className="w-4 h-4" />
                  </button>
                  <button className="hover:text-zinc-200 transition cursor-not-allowed">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-500">
                  <span>8 replies</span>
                  <span className="mx-1.5">·</span>
                  <span>142 likes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. INSTAGRAM PREVIEW MOCKUP */}
        {platform === "instagram" && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-w-sm mx-auto shadow-md">
            {/* Insta Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-[10px] shadow-inner font-display">
                    {getInitials(userName)}
                  </div>
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-100 hover:underline cursor-pointer">{userName.toLowerCase().replace(/\s/g, "_")}</p>
                  <p className="text-[10px] text-slate-400">California, USA</p>
                </div>
              </div>
              <button className="text-slate-400">•••</button>
            </div>

            {/* Post Media Space */}
            <div className="aspect-square bg-slate-900 border-b border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-slate-900 to-indigo-950/25 pointer-events-none" />
              <div className="z-10 bg-slate-950/90 border border-slate-800 rounded-xl p-4.5 max-w-[280px] shadow-2xl flex flex-col gap-2.5">
                <div className="flex items-center justify-center bg-violet-950/50 w-8 h-8 rounded-lg mb-0.5">
                  <Eye className="w-4 h-4 text-violet-400" />
                </div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-violet-300 font-display">Slide Carousel Blueprint</h5>
                <p className="text-[11px] leading-relaxed text-slate-300 text-left line-clamp-4">
                  {data.visualSuggestion || "Minimal aesthetic infographic displaying the key startup stats, quotes, or metric frameworks."}
                </p>
                <span className="text-[9px] font-mono text-slate-500 mt-2 text-right">
                  Slide Idea Recommended
                </span>
              </div>
            </div>

            {/* Insta Action Bar */}
            <div className="p-3">
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex gap-3.5 text-slate-200">
                  <button className="hover:text-pink-500 transition cursor-not-allowed">
                    <Heart className="w-4.5 h-4.5" />
                  </button>
                  <button className="hover:text-slate-400 transition cursor-not-allowed">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </button>
                  <button className="hover:text-slate-400 transition cursor-not-allowed">
                    <Share2 className="w-4.5 h-4.5" />
                  </button>
                </div>
                <button className="text-slate-200 cursor-not-allowed">
                  <span className="text-xs border border-slate-700 bg-slate-800 px-2 py-0.5 rounded">Carousel</span>
                </button>
              </div>

              {/* Caption Description */}
              <div className="text-xs text-slate-300 space-y-1 select-text">
                <p>
                  <span className="font-bold text-slate-100 mr-1.5">{userName.toLowerCase().replace(/\s/g, "_")}</span>
                  {data.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. REDDIT PREVIEW MOCKUP */}
        {platform === "reddit" && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-lg mx-auto shadow-md flex gap-3 text-slate-200">
            {/* Upvote score sidebar */}
            <div className="flex flex-col items-center gap-1.5 text-slate-500 pt-0.5">
              <button className="p-1 hover:bg-slate-900 rounded transition text-slate-400 hover:text-orange-500 cursor-not-allowed">
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-300">182</span>
              <button className="p-1 hover:bg-slate-900 rounded transition text-slate-400 hover:text-blue-500 cursor-not-allowed">
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 select-text">
              {/* Top sub line */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                <span className="font-bold text-slate-200 hover:underline cursor-pointer">
                  {data.subredditSuggestion || "r/startups"}
                </span>
                <span>•</span>
                <span>Posted by u/founder_engine</span>
                <span>4h ago</span>
              </div>

              {/* Thread Title */}
              <h3 className="text-base font-semibold text-slate-100 leading-snug mb-3">
                {data.title || "How we validated our SaaS MVP using static content"}
              </h3>

              {/* Render Body Post (Markdown block format) */}
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono prose prose-invert bg-slate-900/60 p-3 rounded-lg border border-slate-800 select-text mb-4">
                {data.content}
              </div>

              {/* Comment indicators */}
              <div className="flex gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-full">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>34 Comments</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-full">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Visual Stats Bar Footer */}
      <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between items-center gap-2 font-mono">
        <div>
          <span>Platform Limit Checklist: </span>
          <span className={`font-semibold ml-1 ${
            platform === "x" && data.characterCount > 280 ? "text-red-400" :
            platform === "threads" && data.characterCount > 500 ? "text-red-400" : "text-emerald-400"
          }`}>
            {data.characterCount} chars
          </span>
          <span> / {
            platform === "x" ? "280" :
            platform === "threads" ? "500" : "Uncapped"
          }</span>
        </div>

        {data.hashtags && data.hashtags.length > 0 && (
          <div className="flex gap-1.5 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            {data.hashtags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-violet-400 font-medium">
                #{tag.replace(/^#/, "")}
              </span>
            ))}
            {data.hashtags.length > 3 && (
              <span className="text-slate-500">+{data.hashtags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
