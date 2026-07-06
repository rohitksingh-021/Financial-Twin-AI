"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Check, TrendingUp, Shield, Coins, AlertCircle, ChevronRight } from "lucide-react";

interface CoachAction {
  id: string;
  type: "opportunity" | "alert" | "optimize";
  title: string;
  body: string;
  impact: string;
  cta: string;
  icon: "coins" | "trending" | "shield" | "alert";
  color: string;
}

const COACH_ACTIONS: CoachAction[] = [
  {
    id: "idle-cash",
    type: "opportunity",
    title: "₹35,000 Idle Balance Detected",
    body: "Your savings account has been sitting with excess cash for 3+ months earning just 3.5% interest.",
    impact: "Potential extra ₹1,800/year if moved to liquid fund",
    cta: "Invest Now",
    icon: "coins",
    color: "#10b981",
  },
  {
    id: "sip-boost",
    type: "optimize",
    title: "SIP Boost Opportunity",
    body: "Your income increased by ₹5,000/month since Jan 2026. You haven't adjusted your SIP.",
    impact: "+₹28L extra corpus in 10 years at 12% CAGR",
    cta: "Increase SIP",
    icon: "trending",
    color: "#4f8cff",
  },
  {
    id: "unused-subs",
    type: "optimize",
    title: "3 Unused Subscriptions Found",
    body: "MagicBricks Premium, 99acres Pro, and Amazon Prime haven't been used in 45+ days.",
    impact: "Save ₹3,600/year by cancelling",
    cta: "Review",
    icon: "alert",
    color: "#f59e0b",
  },
];

const iconMap = {
  coins: Coins,
  trending: TrendingUp,
  shield: Shield,
  alert: AlertCircle,
};

export default function AutonomousCoach() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [accepted, setAccepted] = useState<string[]>([]);

  const visible = COACH_ACTIONS.filter(
    (a) => !dismissed.includes(a.id) && !accepted.includes(a.id)
  );

  if (visible.length === 0) return null;

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10b981] to-[#4f8cff] flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Autonomous Wealth Coach</h3>
          <p className="text-[10px] text-[#6b7280]">AI-detected actions requiring your attention</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] pulse-green-anim" />
          {visible.length} action{visible.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Actions */}
      <AnimatePresence>
        <div className="space-y-3">
          {visible.map((action, i) => {
            const Icon = iconMap[action.icon];
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-4 rounded-xl border transition-all duration-300"
                style={{
                  background: `${action.color}08`,
                  borderColor: `${action.color}25`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${action.color}20` }}
                  >
                    <Icon size={16} style={{ color: action.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1">{action.title}</p>
                    <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-2">{action.body}</p>
                    <div className="flex items-center gap-1.5 text-[10px]" style={{ color: action.color }}>
                      <Zap size={10} />
                      <span>{action.impact}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setAccepted((prev) => [...prev, action.id])}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: action.color }}
                    >
                      <Check size={10} />
                      {action.cta}
                    </button>
                    <button
                      onClick={() => setDismissed((prev) => [...prev, action.id])}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] text-[#6b7280] hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <X size={10} />
                      Later
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {visible.length > 0 && (
        <button className="mt-3 w-full flex items-center justify-center gap-1.5 text-[10px] text-[#6b7280] hover:text-[#4f8cff] transition-colors">
          View all coach insights
          <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
}
