"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { formatCurrency, getScoreColor } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function GoalProgress({ goals }: { goals: any[] }) {
  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#9ca3af]">🎯 Goal Progress</h3>
        <Link href="/wealth-gps" className="text-xs text-[#4f8cff] hover:text-[#4f8cff]/80 flex items-center gap-1">
          Wealth GPS <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-3">
        {goals.map((goal: any) => {
          const pct = goal.completion_pct;
          const color = getScoreColor(pct);
          return (
            <div key={goal.id} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {goal.on_track ? (
                    <CheckCircle size={14} className="text-[#10b981]" />
                  ) : (
                    <AlertTriangle size={14} className="text-[#f59e0b]" />
                  )}
                  <span className="text-sm font-medium text-white">{goal.name}</span>
                </div>
                <span className="text-xs font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#6b7280]">
                <span>{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  ETA: {goal.eta?.slice(0, 7)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
