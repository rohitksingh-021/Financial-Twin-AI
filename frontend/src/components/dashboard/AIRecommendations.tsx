"use client";

import { motion } from "framer-motion";
import { Zap, PiggyBank, Shield, TrendingUp } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const categoryIcons: Record<string, any> = {
  invest: TrendingUp,
  save: PiggyBank,
  protect: Shield,
  optimize: Zap,
};

export default function AIRecommendations({ recommendations }: { recommendations: any[] }) {
  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">🤖 AI Recommendations</h3>

      <div className="space-y-3">
        {recommendations.map((rec: any, i: number) => {
          const Icon = categoryIcons[rec.category] || Zap;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#4f8cff]/10 text-[#4f8cff]">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{rec.title}</p>
                  <p className="text-[10px] text-[#6b7280] mt-1">{rec.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-[#10b981] font-medium">↗ {rec.impact}</span>
                    <span className="text-[10px] text-[#6b7280]">Confidence: {rec.confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
