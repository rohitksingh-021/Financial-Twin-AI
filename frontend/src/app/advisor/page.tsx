"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "@/lib/api";
import {
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Shield,
  TrendingUp,
  Brain,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  X,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  PiggyBank,
  Home,
  Receipt,
  HeartHandshake,
  AlertTriangle,
  BarChart3,
  Lightbulb,
  Clock,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  displayContent?: string;
  suggestions?: string[];
  confidence?: number;
  topic?: string;
  dataPoints?: string[];
  timestamp: Date;
  isTyping?: boolean;
  reaction?: "up" | "down" | null;
}

interface QuickCategory {
  label: string;
  icon: any;
  color: string;
  query: string;
  description: string;
}

const quickCategories: QuickCategory[] = [
  { label: "Invest", icon: TrendingUp, color: "#4f8cff", query: "Where should I invest my money?", description: "Portfolio & SIP" },
  { label: "Save More", icon: PiggyBank, color: "#10b981", query: "How can I save more money each month?", description: "Spending analysis" },
  { label: "Home Loan", icon: Home, color: "#7c3aed", query: "Am I ready to buy a house?", description: "Purchase readiness" },
  { label: "Tax Tips", icon: Receipt, color: "#f59e0b", query: "How can I save more on taxes?", description: "80C & deductions" },
  { label: "Insurance", icon: Shield, color: "#f43f5e", query: "Review my insurance coverage", description: "Coverage analysis" },
  { label: "Emergency", icon: AlertTriangle, color: "#00d4ff", query: "How is my emergency fund?", description: "Safety net check" },
  { label: "Retirement", icon: HeartHandshake, color: "#a78bfa", query: "Am I on track for retirement?", description: "Long-term planning" },
  { label: "Debt Plan", icon: BarChart3, color: "#fb923c", query: "Help me manage my loans and debt", description: "EMI optimization" },
];

const defaultSuggestions = [
  "Where should I invest?",
  "Am I ready to buy a house?",
  "How can I save more?",
  "Review my tax savings",
  "Insurance coverage check",
  "Retirement planning advice",
];

const avatarMoods = {
  default: { emoji: "🤖", color: "#4f8cff", label: "Ready to help" },
  thinking: { emoji: "🤔", color: "#7c3aed", label: "Analyzing your data..." },
  happy: { emoji: "😊", color: "#10b981", label: "Great news!" },
  alert: { emoji: "⚠️", color: "#f59e0b", label: "Heads up" },
  confident: { emoji: "💡", color: "#00d4ff", label: "Got an insight!" },
};

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const color =
    confidence >= 85 ? "#10b981" : confidence >= 70 ? "#4f8cff" : "#f59e0b";
  const label =
    confidence >= 85 ? "High" : confidence >= 70 ? "Moderate" : "Estimating";
  return (
    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <span className="text-[10px] text-[#6b7280] whitespace-nowrap">
        AI Confidence
      </span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold whitespace-nowrap" style={{ color }}>
        {confidence}% · {label}
      </span>
    </div>
  );
}

function ExplainPanel({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);
  if (!points || points.length === 0) return null;
  return (
    <div className="mt-2 border-t border-white/[0.06] pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] text-[#6b7280] hover:text-[#4f8cff] transition-colors group"
      >
        <Info size={11} className="group-hover:rotate-12 transition-transform" />
        Why this advice?
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5 p-2 rounded-lg bg-white/[0.02]">
              {points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-[#9ca3af]">
                  <span className="text-[#4f8cff] mt-0.5 flex-shrink-0">▸</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentBadge({ topic }: { topic?: string }) {
  const agentMap: Record<string, { label: string; icon: any; color: string }> = {
    investment: { label: "Investment Strategist", icon: TrendingUp, color: "#4f8cff" },
    savings: { label: "Behavioral Coach", icon: Brain, color: "#7c3aed" },
    home: { label: "Goal Planner", icon: Home, color: "#10b981" },
    tax: { label: "Tax Compliance Agent", icon: Receipt, color: "#f59e0b" },
    insurance: { label: "Risk Manager", icon: Shield, color: "#f43f5e" },
    debt: { label: "Debt Analyst", icon: BarChart3, color: "#00d4ff" },
    retirement: { label: "Retirement Planner", icon: HeartHandshake, color: "#a78bfa" },
    emergency: { label: "Risk Manager", icon: AlertTriangle, color: "#fb923c" },
    greeting: { label: "AI Orchestrator", icon: Sparkles, color: "#4f8cff" },
    general: { label: "AI Orchestrator", icon: Sparkles, color: "#4f8cff" },
  };
  const agent = agentMap[topic || ""] || { label: "AI Orchestrator", icon: Sparkles, color: "#4f8cff" };
  const Icon = agent.icon;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-[9px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
      style={{
        background: `${agent.color}18`,
        color: agent.color,
        border: `1px solid ${agent.color}35`,
      }}
    >
      <Icon size={9} />
      {agent.label}
    </motion.span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-[#6b7280] hover:text-white"
      title="Copy message"
    >
      {copied ? <Check size={11} className="text-[#10b981]" /> : <Copy size={11} />}
    </button>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// Enhanced markdown renderer: bold, numbered lists, bullets, headers
function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 mb-1">
          <span className="text-[#4f8cff] font-bold text-xs flex-shrink-0 min-w-[16px]">{numMatch[1]}.</span>
          <span>{renderInlineBold(numMatch[2])}</span>
        </div>
      );
    }
    // Bullet
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const content = trimmed.replace(/^[-•]\s+/, "");
      return (
        <div key={lineIdx} className="flex items-start gap-2 mb-1">
          <span className="text-[#4f8cff] mt-1 flex-shrink-0">•</span>
          <span>{renderInlineBold(content)}</span>
        </div>
      );
    }
    // Empty line
    if (trimmed === "") return <div key={lineIdx} className="h-1.5" />;
    return <p key={lineIdx} className="mb-0.5">{renderInlineBold(line)}</p>;
  });
}

// Animated typing dots
function TypingDots() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex gap-1">
        {[0, 180, 360].map((delay) => (
          <motion.div
            key={delay}
            className="w-2 h-2 rounded-full bg-[#4f8cff]"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: delay / 1000, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="text-xs text-[#6b7280]">Analyzing your financial data...</span>
    </div>
  );
}

function ReactionButtons({
  messageId, reaction, onReact,
}: {
  messageId: string;
  reaction: "up" | "down" | null | undefined;
  onReact: (id: string, r: "up" | "down") => void;
}) {
  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/[0.04]">
      <span className="text-[9px] text-[#4b5563] mr-1">Helpful?</span>
      <button
        onClick={() => onReact(messageId, "up")}
        className={`p-1 rounded-lg transition-all ${
          reaction === "up" ? "bg-[#10b981]/20 text-[#10b981]" : "text-[#4b5563] hover:text-[#10b981] hover:bg-[#10b981]/10"
        }`}
        title="Helpful"
      >
        <ThumbsUp size={11} />
      </button>
      <button
        onClick={() => onReact(messageId, "down")}
        className={`p-1 rounded-lg transition-all ${
          reaction === "down" ? "bg-[#f43f5e]/20 text-[#f43f5e]" : "text-[#4b5563] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10"
        }`}
        title="Not helpful"
      >
        <ThumbsDown size={11} />
      </button>
      {reaction === "up" && <span className="text-[9px] text-[#10b981] ml-1">Thanks! 🎉</span>}
      {reaction === "down" && <span className="text-[9px] text-[#f43f5e] ml-1">We'll improve!</span>}
    </div>
  );
}

function MessageBubble({
  msg,
  onSuggestionClick,
  onReact,
}: {
  msg: Message;
  onSuggestionClick: (s: string) => void;
  onReact: (id: string, r: "up" | "down") => void;
}) {
  const isAI = msg.role === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isAI ? "justify-start" : "justify-end"} group`}
    >
      {/* AI avatar dot */}
      {isAI && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4f8cff] to-[#7c3aed] flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-lg">
          <Sparkles size={12} className="text-white" />
        </div>
      )}

      <div className={`max-w-[85%] ${isAI ? "chat-bubble-ai" : "chat-bubble-user"} p-4`}>
        {/* AI Header */}
        {isAI && (
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="text-[10px] font-bold text-[#4f8cff]">AI Advisor</span>
            {msg.topic && !msg.isTyping && <AgentBadge topic={msg.topic} />}
            <div className="ml-auto flex items-center gap-1">
              <Clock size={9} className="text-[#4b5563]" />
              <span className="text-[9px] text-[#4b5563]">{formatTime(msg.timestamp)}</span>
              {!msg.isTyping && <CopyButton text={msg.content} />}
            </div>
          </div>
        )}

        {/* Content */}
        {msg.isTyping ? (
          <TypingDots />
        ) : (
          <div className="text-sm text-[#e0e0e5] leading-relaxed">
            {isAI ? renderMarkdown(msg.displayContent ?? msg.content) : msg.content}
          </div>
        )}

        {/* User timestamp */}
        {!isAI && (
          <div className="flex items-center justify-end gap-1 mt-1.5">
            <span className="text-[9px] text-[#4b5563]">{formatTime(msg.timestamp)}</span>
            <CopyButton text={msg.content} />
          </div>
        )}

        {/* Confidence bar */}
        {isAI && !msg.isTyping && msg.confidence !== undefined && (
          <ConfidenceMeter confidence={msg.confidence} />
        )}

        {/* Explain panel */}
        {isAI && !msg.isTyping && msg.dataPoints && msg.dataPoints.length > 0 && (
          <ExplainPanel points={msg.dataPoints} />
        )}

        {/* Follow-up suggestion chips */}
        {isAI && !msg.isTyping && msg.suggestions && msg.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]"
          >
            <span className="text-[9px] text-[#4b5563] w-full mb-1 flex items-center gap-1">
              <Lightbulb size={9} /> Explore further:
            </span>
            {msg.suggestions.map((s: string, j: number) => (
              <button
                key={j}
                onClick={() => onSuggestionClick(s)}
                className="text-[10px] px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#9ca3af] hover:text-white hover:bg-[#4f8cff]/15 hover:border-[#4f8cff]/50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {/* Reaction buttons */}
        {isAI && !msg.isTyping && msg.id !== "init" && (
          <ReactionButtons messageId={msg.id} reaction={msg.reaction} onReact={onReact} />
        )}
      </div>
    </motion.div>
  );
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content:
        "👋 Hello! I'm your **AI Financial Advisor** — an 8-agent intelligence system with your complete financial profile loaded.\n\n📊 I've analyzed your investment portfolio, 12 months of transactions, loans, insurance, and goals.\n\nYour **Financial Vitality Score is 72/100** — pretty solid! I'm ready to give you hyper-personalized advice on investments, savings, taxes, insurance, retirement, and more.\n\n**What would you like to explore today?**",
      displayContent:
        "👋 Hello! I'm your **AI Financial Advisor** — an 8-agent intelligence system with your complete financial profile loaded.\n\n📊 I've analyzed your investment portfolio, 12 months of transactions, loans, insurance, and goals.\n\nYour **Financial Vitality Score is 72/100** — pretty solid! I'm ready to give you hyper-personalized advice on investments, savings, taxes, insurance, retirement, and more.\n\n**What would you like to explore today?**",
      suggestions: defaultSuggestions,
      confidence: 92,
      dataPoints: [
        "Analyzed 12 months of transaction data",
        "Reviewed 7 investment instruments",
        "Assessed 4 active goals",
        "Risk profile: Moderate",
      ],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarMood, setAvatarMood] = useState<keyof typeof avatarMoods>("default");
  const [pulseAvatar, setPulseAvatar] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showQuickCategories, setShowQuickCategories] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageIdCounter = useRef(1);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Typewriter effect
  const typewriterEffect = useCallback((messageId: string, fullText: string) => {
    let i = 0;
    const interval = setInterval(() => {
      i += 4;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, displayContent: fullText.slice(0, i), isTyping: false } : m
        )
      );
      if (i >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, displayContent: fullText } : m))
        );
      }
    }, 18);
  }, []);

  const handleReact = (messageId: string, r: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reaction: m.reaction === r ? null : r } : m))
    );
  };

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setShowQuickCategories(false);
    inputRef.current?.focus();

    const userMsgId = `user-${messageIdCounter.current++}`;
    const aiMsgId = `ai-${messageIdCounter.current++}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: msg, timestamp: new Date() },
    ]);

    // Add typing placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        role: "ai",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    setIsLoading(true);
    setAvatarMood("thinking");
    setPulseAvatar(true);

    try {
      const res = await sendChatMessage(msg);
      const fullContent = res.message;

      // Replace typing placeholder with real message (start typewriter)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content: fullContent,
                displayContent: "",
                suggestions: res.suggestions,
                confidence: res.context?.confidence,
                topic: res.context?.topic,
                dataPoints: res.context?.data_points,
                isTyping: false,
              }
            : m
        )
      );
      typewriterEffect(aiMsgId, fullContent);

      setAvatarMood(
        (res.context?.confidence || 0) >= 85
          ? "confident"
          : res.context?.topic === "insurance" || res.context?.topic === "debt"
          ? "alert"
          : "happy"
      );
    } catch {
      const fallback = getFallbackResponse(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content: fallback.message,
                displayContent: "",
                suggestions: fallback.suggestions,
                confidence: fallback.confidence,
                topic: fallback.topic,
                dataPoints: fallback.dataPoints,
                isTyping: false,
              }
            : m
        )
      );
      typewriterEffect(aiMsgId, fallback.message);
      setAvatarMood("confident");
    }

    setIsLoading(false);
    setTimeout(() => {
      setAvatarMood("default");
      setPulseAvatar(false);
    }, 4000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "init-reset",
        role: "ai",
        content:
          "Chat cleared! 🔄 My financial profile analysis is still loaded. What would you like to explore?\n\n**Your quick options:**\n- Ask about investments, savings, or tax\n- Check goal progress\n- Simulate a financial scenario",
        displayContent:
          "Chat cleared! 🔄 My financial profile analysis is still loaded. What would you like to explore?\n\n**Your quick options:**\n- Ask about investments, savings, or tax\n- Check goal progress\n- Simulate a financial scenario",
        suggestions: defaultSuggestions,
        confidence: 92,
        dataPoints: [],
        timestamp: new Date(),
      },
    ]);
    setShowClearConfirm(false);
    setShowQuickCategories(true);
  };

  const mood = avatarMoods[avatarMood];

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <MessageCircle size={24} className="text-[#4f8cff]" />
            AI Financial Advisor
          </h1>
          <p className="text-sm text-[#6b7280]">
            8-Agent AI · Explainable recommendations · Real-time financial insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Online badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] pulse-green-anim" />
            <span className="text-[10px] text-[#10b981] font-medium">Online</span>
          </div>
          {/* Clear chat */}
          <div className="relative">
            {showClearConfirm ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-2 rounded-xl glass-card-static border border-[#f43f5e]/30"
              >
                <span className="text-xs text-[#f43f5e]">Clear chat?</span>
                <button
                  onClick={handleClear}
                  className="text-[10px] px-2 py-1 rounded-lg bg-[#f43f5e]/20 text-[#f43f5e] hover:bg-[#f43f5e]/30 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="p-1 text-[#6b7280] hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
                title="Clear chat"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* AI Avatar Panel — hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-[200px] flex-shrink-0 hidden lg:block"
        >
          <div className="glass-card p-4 flex flex-col items-center gap-4 sticky top-0">
            {/* Avatar */}
            <div className="relative">
              <motion.div
                animate={pulseAvatar ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl relative"
                style={{
                  background: `radial-gradient(circle, ${mood.color}20, ${mood.color}05)`,
                  border: `2px solid ${mood.color}40`,
                  boxShadow: `0 0 30px ${mood.color}25`,
                }}
              >
                {mood.emoji}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-6px] rounded-full"
                  style={{ border: `1px dashed ${mood.color}40` }}
                />
              </motion.div>
              <div
                className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0e27] pulse-green-anim"
                style={{ backgroundColor: mood.color }}
              />
            </div>

            <div className="text-center">
              <p className="text-xs font-bold text-white">Financial Twin AI</p>
              <p className="text-[10px] mt-0.5" style={{ color: mood.color }}>
                {mood.label}
              </p>
            </div>

            {/* Agent Status */}
            <div className="w-full space-y-2">
              <p className="text-[9px] text-[#6b7280] uppercase tracking-wider text-center">
                Active Agents
              </p>
              {[
                { name: "Financial Analyst", status: "active", color: "#4f8cff" },
                { name: "Investment Strategist", status: "active", color: "#7c3aed" },
                { name: "Risk Manager", status: "standby", color: "#f43f5e" },
                { name: "Goal Planner", status: "active", color: "#10b981" },
                { name: "Behavioral Coach", status: "standby", color: "#f59e0b" },
                { name: "Explainability AI", status: "active", color: "#00d4ff" },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center gap-2">
                  <motion.div
                    animate={
                      agent.status === "active" && avatarMood === "thinking"
                        ? { opacity: [1, 0.3, 1] }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        agent.status === "active" ? agent.color : "#374151",
                    }}
                  />
                  <span className="text-[9px] text-[#6b7280] truncate">{agent.name}</span>
                  <span
                    className="ml-auto text-[8px] px-1 rounded"
                    style={{
                      color: agent.status === "active" ? agent.color : "#4b5563",
                      background:
                        agent.status === "active" ? `${agent.color}15` : "transparent",
                    }}
                  >
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial IQ */}
            <div className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[9px] text-[#6b7280] mb-2">Financial IQ</p>
              {[
                { label: "Data Accuracy", val: 94 },
                { label: "Prediction Rate", val: 87 },
              ].map((item) => (
                <div key={item.label} className="mb-1.5">
                  <div className="flex justify-between text-[8px] mb-0.5">
                    <span className="text-[#6b7280]">{item.label}</span>
                    <span className="text-[#4f8cff]">{item.val}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4f8cff]"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Message count */}
            <div className="w-full text-center py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[9px] text-[#6b7280]">Messages</p>
              <p className="text-xl font-bold text-white mt-0.5">{messages.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onSuggestionClick={handleSend}
                  onReact={handleReact}
                />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Quick category grid shown at session start */}
          <AnimatePresence>
            {showQuickCategories && messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="mb-3"
              >
                <p className="text-[10px] text-[#6b7280] mb-2 flex items-center gap-1">
                  <Zap size={10} className="text-[#4f8cff]" /> Quick topics
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <motion.button
                        key={cat.label}
                        onClick={() => handleSend(cat.query)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl glass-card-static border text-left group transition-all"
                        style={{ borderColor: `${cat.color}25` }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${cat.color}18` }}
                        >
                          <Icon size={14} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-white">{cat.label}</p>
                          <p className="text-[9px] text-[#6b7280]">{cat.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card-static rounded-2xl border border-white/[0.08] focus-within:border-[#4f8cff]/40 focus-within:shadow-[0_0_20px_rgba(79,140,255,0.08)] transition-all"
          >
            {/* Inline quick chips */}
            {!isLoading && (
              <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
                {["📈 Invest", "💰 Save more", "🧾 Tax tips", "🏠 Home loan", "🛡️ Insurance", "📊 Goals"].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q.replace(/^[^\s]+\s/, ""))}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/[0.08] text-[#9ca3af] hover:text-white hover:border-[#4f8cff]/40 hover:bg-[#4f8cff]/10 transition-all whitespace-nowrap flex-shrink-0 active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Loading progress bar */}
            {isLoading && (
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <Sparkles size={11} className="text-[#7c3aed]" />
                  </motion.div>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#4f8cff] to-[#7c3aed] rounded-full"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ width: "40%" }}
                    />
                  </div>
                  <span className="text-[9px] text-[#6b7280]">Thinking...</span>
                </div>
              </div>
            )}

            {/* Textarea row */}
            <div className="flex items-end gap-3 p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about your finances... (Enter to send, Shift+Enter for newline)"
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-[#4b5563] disabled:opacity-50 resize-none leading-relaxed min-h-[22px] max-h-[120px]"
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {input.length > 0 && (
                  <span className={`text-[9px] ${input.length > 300 ? "text-[#f43f5e]" : "text-[#4b5563]"}`}>
                    {input.length}
                  </span>
                )}
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="p-2.5 rounded-xl bg-white/10"
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Sparkles size={16} className="text-[#7c3aed]" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="send"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      whileHover={input.trim() ? { scale: 1.08 } : {}}
                      whileTap={input.trim() ? { scale: 0.92 } : {}}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#4f8cff] to-[#7c3aed] text-white disabled:opacity-25 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#4f8cff]/25 transition-all flex-shrink-0"
                    >
                      <Send size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-[9px] text-[#374151] mt-2">
            AI advisor provides personalized insights · Not regulated investment advice · Powered by 8-agent AI
          </p>
        </div>
      </div>
    </div>
  );
}

function getFallbackResponse(msg: string): {
  message: string;
  suggestions: string[];
  confidence: number;
  topic: string;
  dataPoints: string[];
} {
  const m = msg.toLowerCase();

  if (m.includes("invest") || m.includes("sip") || m.includes("mutual") || m.includes("portfolio"))
    return {
      message:
        "Based on your **moderate risk profile** (age 32), here's my investment analysis:\n\n📊 **Current Portfolio**: ₹18.9L across 7 asset classes\n📈 **Weighted Return**: 11.2% CAGR\n\n**My Recommendations:**\n1. Increase equity allocation to 65% (currently ~55%) — time is on your side\n2. Add international exposure via Nasdaq/S&P 500 index fund (5-10%)\n3. Boost SIP by ₹10,000/month → extra ₹28L in 10 years at 12% CAGR\n4. Continue PPF for tax-efficient debt component\n5. Maximize NPS (₹50K 80CCD benefit still available)\n\n✅ **Action**: Set up a SIP step-up of ₹2,000/year to automate wealth growth.",
      suggestions: ["Simulate ₹10K more SIP", "Show portfolio allocation", "Compare fund options", "International funds"],
      confidence: 85,
      topic: "investment",
      dataPoints: [
        "Portfolio: ₹18.9L across 7 instruments",
        "Current equity ratio: ~55% (target 65% for age 32)",
        "Blended return: 11.2% CAGR",
        "NPS 80CCD gap: ₹50,000 available",
      ],
    };
  if (m.includes("house") || m.includes("home") || m.includes("property") || m.includes("flat"))
    return {
      message:
        "🏠 **Home Purchase Readiness Analysis**\n\n📊 **Goal Progress**: 15% complete (₹12L of ₹80L target)\n\n**Readiness Checklist:**\n✅ Stable income — 24+ months with consistent salary\n✅ Credit score inquiry done\n⬜ Down payment: Still need ₹4L more (20% = ₹16L)\n⬜ Emergency fund post-purchase: need ₹6L buffer\n\n**Home Loan Estimate:**\n- Eligible amount: ~₹72L (4x annual income at ₹18L)\n- Approx EMI: ~₹62,000/month (8.5%, 20yr)\n- EMI-to-income: 41% — slightly stretched (ideal <40%)\n\n⚠️ **Recommendation**: Increase savings by ₹8K/month for 12 months first, then proceed. Transaction data shows strong home purchase intent.",
      suggestions: ["Simulate mortgage scenarios", "View Wealth GPS for house", "How to save faster", "Home loan rates"],
      confidence: 82,
      topic: "home",
      dataPoints: [
        "Home goal: 15% funded (₹12L of ₹80L)",
        "Loan eligibility: ~₹72L (4x income)",
        "EMI at 8.5%/20yr: ~₹62,000/month",
        "87% home purchase probability detected from transactions",
      ],
    };
  if (m.includes("save") || m.includes("saving") || m.includes("expense") || m.includes("spending"))
    return {
      message:
        "💰 **Savings & Spending Deep Dive**\n\n📊 **Current savings rate**: ~18.5% (Target: 30%)\n\n**Top Monthly Expenses (12-month avg):**\n- 🏠 Rent: ₹35,000/month (fixed)\n- 🛒 Groceries: ₹12,000/month\n- 🍔 Food & Dining: ₹4,000-6,000/month\n- 📺 Subscriptions: ₹1,500+/month\n- 🛍️ Shopping: Spikes in Oct-Dec (Diwali)\n\n**Quick Wins to Save ₹8-12K/month:**\n1. Auto-transfer 25% salary on day 1 — \"pay yourself first\"\n2. Cancel 2 low-use subscriptions (~₹600/month savings)\n3. Switch to cashback credit card for groceries (2-5% back)\n4. Shopping budget cap: ₹8,000/month outside festive season\n\n✅ **Biggest opportunity**: Your idle ₹27,833/month could earn ₹20K+/year in a liquid fund.",
      suggestions: ["Find unused subscriptions", "Set auto-savings goal", "Auto-invest surplus", "Cashback strategies"],
      confidence: 90,
      topic: "savings",
      dataPoints: [
        "Current savings rate: 18.5% (target: 30%)",
        "Monthly idle balance: ₹27,833",
        "Subscription spend: ₹1,500+/month",
        "Shopping spikes detected Nov-Dec (Diwali season)",
      ],
    };
  if (m.includes("tax") || m.includes("80c") || m.includes("elss") || m.includes("deduct"))
    return {
      message:
        "🧾 **Tax Optimization — Full Analysis**\n\n**Section 80C (Limit: ₹1,50,000):**\n- PPF: ₹1,04,000/year ✅\n- Insurance premiums: ₹27,000/year ✅\n- Used: ₹1,31,000 | **Gap remaining: ₹19,000**\n→ Invest ₹19K in ELSS for full 80C utilization\n\n**Additional Deductions Available:**\n- 80CCD(1B) NPS: ₹50,000 extra deduction still available\n- 80D Health Insurance: ₹25,000 premium deductible\n- 80EEA: Home loan interest benefit when you buy\n- HRA: Optimize if renting (₹4.2L/year claim possible)\n\n💡 **Total potential tax saving: ₹35,000-50,000/year** at 30% bracket\n\n✅ **Immediate action**: Put ₹19K in a tax-saving ELSS fund before March 31.",
      suggestions: ["Best ELSS funds to pick", "NPS vs PPF comparison", "HRA calculation", "New vs Old tax regime"],
      confidence: 90,
      topic: "tax",
      dataPoints: [
        "80C used: ₹1,31,000 of ₹1,50,000 limit",
        "NPS 80CCD(1B) gap: ₹50,000 available",
        "Estimated tax bracket: 30%",
        "Potential annual tax saving: ₹35,000-50,000",
      ],
    };
  if (m.includes("retire") || m.includes("pension") || m.includes("old age"))
    return {
      message:
        "🏖️ **Retirement Planning Analysis**\n\n⏰ **Years to retirement**: 28 years (retire at 60)\n📊 **Current corpus**: ₹1.69L\n🎯 **Target**: ₹5 Crore\n\n**Projected corpus at age 60:**\n- Optimistic (14% return): **₹7.8 Crore** 🟢\n- Realistic (12% return): **₹5.4 Crore** 🟡\n- Conservative (9% return): **₹3.1 Crore** 🔴\n\n**Monthly SIP needed for ₹5Cr**: ~₹8,200/month at 12% CAGR\n✅ You're already investing more — you're on track!\n\n**Key Actions:**\n1. Maximize NPS (80CCD tax benefit + corpus)\n2. Increase equity SIP annually by 10% (step-up)\n3. Don't break investments for short-term goals\n4. Review target every 5 years for inflation adjustment",
      suggestions: ["Simulate early retirement at 50", "Increase NPS contribution", "Retirement corpus calculator", "Best retirement funds"],
      confidence: 80,
      topic: "retirement",
      dataPoints: [
        "Time horizon: 28 years",
        "Current corpus: ₹1.69L",
        "Target: ₹5 Crore",
        "Required SIP at 12%: ₹8,200/month",
      ],
    };
  if (m.includes("insurance") || m.includes("cover") || m.includes("term"))
    return {
      message:
        "🛡️ **Insurance Coverage Review**\n\n**Life Cover**: ₹1,00,00,000 (₹1Cr) at 5.6x annual income\n⚠️ Recommended: 10x income = ₹1.8Cr\nGap: ₹80L — add a term plan (~₹6,000-8,000/year at age 32)\n\n**Health Cover**: ₹5,00,000\n⚠️ Low for metro hospitalizations (₹3-8L per event)\nAdd ₹10-15L super top-up (~₹3,500/year)\n\n**Missing Coverage:**\n- Critical Illness rider — highly recommended at 32\n- Personal Accident cover — important for family breadwinner\n\n💡 **Total additional premium needed**: ~₹15,000-20,000/year for complete protection",
      suggestions: ["Compare term plans", "Super top-up options", "Critical illness riders", "PA cover calculator"],
      confidence: 92,
      topic: "insurance",
      dataPoints: [
        "Life cover: ₹1Cr (5.6x income, need 10x)",
        "Health cover: ₹5L (low for metro family of 3)",
        "Dependents: 2",
        "Recommended additional premium: ₹15K-20K/year",
      ],
    };
  if (m.includes("loan") || m.includes("emi") || m.includes("debt") || m.includes("borrow"))
    return {
      message:
        "📋 **Debt Management Analysis**\n\n**Current Debt Snapshot:**\n- Total outstanding: ₹3,20,000\n- Monthly EMI: ₹15,000\n- EMI-to-income ratio: 9.8% ✅ (healthy, below 30%)\n\n**Active Loan:**\n- Personal Loan @ 11.5% — ₹3.2L outstanding, 24 months left\n- ⚠️ High interest rate — priority to close\n\n**Strategy:**\n1. **Prepay ₹50,000** → saves ~₹8,500 in interest + closes 4 months earlier\n2. Don't take new unsecured debt until this is closed\n3. After personal loan: redirect EMI to SIP\n4. For home loan: budget EMI at max 35% of income\n\n✅ **Good news**: Your debt burden is very manageable. Focus on prepayment over next 6 months.",
      suggestions: ["Simulate loan prepayment", "Home loan eligibility check", "Debt freedom timeline", "Compare loan rates"],
      confidence: 88,
      topic: "debt",
      dataPoints: [
        "Total outstanding: ₹3,20,000",
        "EMI-to-income: 9.8% (healthy)",
        "Personal loan rate: 11.5% (highest priority)",
        "Loan closure: 24 months remaining",
      ],
    };
  if (m.includes("emergency") || m.includes("safety") || m.includes("buffer") || m.includes("contingency"))
    return {
      message:
        "🆘 **Emergency Fund Status**\n\n📊 **Current**: ₹4,10,000 (covers 2.1 months)\n🎯 **Target**: ₹5,70,000 (6 months of expenses)\n⚠️ **Gap**: ₹1,60,000 remaining\n\n**Why this matters:**\nA 6-month emergency fund means job loss or medical emergency without touching investments.\n\n**Build plan:**\n1. Allocate ₹13,333/month to liquid fund\n2. Goal achieved in: ~12 months\n3. Keep in: Liquid mutual fund or sweep FD\n4. Don't invest in equity — needs instant access\n\n✅ **Suggested**: Any AAA-rated liquid fund with same-day redemption.",
      suggestions: ["Best liquid funds", "Set up auto-SIP for emergency", "Review monthly expenses", "Sweep FD vs liquid fund"],
      confidence: 95,
      topic: "emergency",
      dataPoints: [
        "Current emergency fund: ₹4,10,000",
        "Coverage: 2.1 months (target: 6 months)",
        "Monthly expenses: ~₹95,000",
        "Gap: ₹1,60,000 to reach target",
      ],
    };
  if (m.includes("goal") || m.includes("track") || m.includes("progress"))
    return {
      message:
        "🎯 **Goal Progress Report**\n\n1. 🏠 **Buy a House (₹80L)** — 15% complete\n   - On track: ❌ (need to increase monthly savings)\n   - ETA: 2030 (2 years behind schedule)\n\n2. 💸 **Emergency Fund (₹6L)** — 68% complete\n   - On track: ✅\n   - ETA: ~12 months\n\n3. 🏖️ **Retirement (₹5Cr)** — 3.4% started\n   - On track: ✅ (compound interest working)\n   - ETA: 2048\n\n4. ✈️ **Goa Vacation (₹1.5L)** — 85% funded!\n   - On track: ✅\n   - ETA: ~4 months away 🎉\n\n**Priority action**: Focus on House and Emergency fund goals first.",
      suggestions: ["Boost house savings", "View Wealth GPS", "Simulate retirement", "Plan Goa trip"],
      confidence: 88,
      topic: "investment",
      dataPoints: [
        "4 active financial goals",
        "2 goals on track, 1 behind schedule",
        "House goal: biggest gap to address",
        "Vacation goal nearly complete",
      ],
    };
  return {
    message:
      "I'd be happy to help you with that! Here's what I can advise on based on your financial profile:\n\n📈 **Investments** — Portfolio review, SIP optimization, asset allocation\n💰 **Savings** — Expense analysis, saving strategies, idle balance optimization\n🏠 **Goals** — Home purchase, retirement, education planning\n🧾 **Taxes** — Section 80C, 80D, NPS deductions, ELSS\n🛡️ **Insurance** — Life, health, critical illness coverage review\n📋 **Debt** — Loan management, EMI optimization, prepayment strategy\n📊 **What-If Scenarios** — Simulate any financial decision\n\nTry asking something specific like:\n- \"Should I increase my SIP or pay off my loan?\"\n- \"How much more do I need to save for a house?\"\n- \"What's the best way to save on taxes?\"",
    suggestions: ["Review my full finances", "Where should I invest?", "Am I on track for my goals?", "Tax saving tips"],
    confidence: 75,
    topic: "general",
    dataPoints: [
      "Financial profile fully loaded",
      "12 months of transaction history analyzed",
      "7 investment instruments tracked",
      "4 active goals monitored",
    ],
  };
}
