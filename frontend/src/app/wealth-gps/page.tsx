"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchWealthGPS } from "@/lib/api";
import { FALLBACK_WEALTH_GPS } from "@/lib/data";
import { formatCurrency, getScoreColor } from "@/lib/utils";
import { Navigation, MapPin, Flag, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function WealthGPSPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    fetchWealthGPS().then(setGoals).catch(() => setGoals(FALLBACK_WEALTH_GPS));
  }, []);

  if (!goals.length) return <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-[#4f8cff]/30 border-t-[#4f8cff] rounded-full animate-spin" /></div>;

  const goal = goals[selected];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><Navigation size={24} className="text-[#4f8cff]" /> Wealth GPS™</h1>
        <p className="text-sm text-[#6b7280] mb-6">Your navigation system for financial goals — like Google Maps for wealth creation</p>
      </motion.div>

      {/* Goal selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {goals.map((g: any, i: number) => (
          <button key={g.id} onClick={() => setSelected(i)} className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${selected === i ? "bg-[#4f8cff]/20 text-[#4f8cff] border border-[#4f8cff]/30 glow-blue" : "glass-card-static text-[#9ca3af] hover:text-white"}`}>
            {g.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Visualization */}
        <motion.div key={goal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-6">Route to {goal.name}</h3>

          {/* GPS-style Route */}
          <div className="relative py-4">
            {/* Route line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-[#4f8cff] to-[#10b981]" style={{ height: `${Math.min(goal.completion_pct, 100)}%` }} />

            {/* Start */}
            <div className="relative flex items-start gap-4 mb-8 pl-2">
              <div className="w-9 h-9 rounded-full bg-[#4f8cff] flex items-center justify-center z-10 shadow-lg" style={{ boxShadow: "0 0 15px rgba(79,140,255,0.4)" }}>
                <MapPin size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Current Position</p>
                <p className="text-xs text-[#6b7280]">{formatCurrency(goal.current_amount)} saved ({goal.completion_pct.toFixed(0)}%)</p>
              </div>
            </div>

            {/* Waypoints */}
            {goal.waypoints?.map((wp: any, i: number) => (
              <div key={i} className="relative flex items-start gap-4 mb-6 pl-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${wp.status === "completed" ? "bg-[#10b981]" : wp.status === "upcoming" ? "bg-[#f59e0b]" : "bg-white/10"}`}>
                  {wp.status === "completed" ? <CheckCircle size={16} className="text-white" /> : wp.percentage === 100 ? <Flag size={16} className="text-white" /> : <span className="text-[10px] font-bold text-white">{wp.percentage}%</span>}
                </div>
                <div>
                  <p className={`text-xs font-medium ${wp.status === "completed" ? "text-[#10b981]" : "text-[#9ca3af]"}`}>{wp.label}</p>
                  <p className="text-[10px] text-[#6b7280]">{wp.status === "completed" ? "✓ Achieved" : wp.status === "upcoming" ? "Next milestone" : "Pending"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.06]">
            <div className="text-center">
              <p className="text-xs text-[#6b7280]">Monthly Required</p>
              <p className="text-lg font-bold text-white">{formatCurrency(goal.monthly_required)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6b7280]">Current Contribution</p>
              <p className="text-lg font-bold text-[#4f8cff]">{formatCurrency(goal.monthly_contribution)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6b7280]">Monthly Gap</p>
              <p className="text-lg font-bold" style={{ color: goal.gap > 0 ? "#f43f5e" : "#10b981" }}>{formatCurrency(goal.gap)}</p>
            </div>
          </div>
        </motion.div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Probability */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-[#9ca3af] mb-3">Goal Completion</h3>
            <div className="text-center mb-3">
              <p className="text-4xl font-bold" style={{ color: getScoreColor(goal.probability) }}>{goal.probability.toFixed(0)}%</p>
              <p className="text-xs text-[#6b7280]">with current plan</p>
            </div>
            {goal.optimized_probability > goal.probability && (
              <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-center">
                <p className="text-sm font-semibold text-[#10b981]">{goal.optimized_probability.toFixed(0)}%</p>
                <p className="text-[10px] text-[#10b981]/70">with optimized plan</p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs text-[#6b7280]">
              <Clock size={12} />
              <span>ETA: {goal.eta?.slice(0, 7)}</span>
            </div>
          </motion.div>

          {/* Alternatives */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-[#9ca3af] mb-3">Alternative Routes</h3>
            <div className="space-y-3">
              {goal.alternatives?.map((alt: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowRight size={12} className="text-[#4f8cff]" />
                    <span className="text-xs font-medium text-white">{alt.name}</span>
                  </div>
                  <p className="text-[10px] text-[#6b7280]">{alt.description}</p>
                  <span className={`text-[9px] mt-1 inline-block px-2 py-0.5 rounded-full ${alt.feasibility === "Easy" ? "bg-[#10b981]/15 text-[#10b981]" : alt.feasibility === "High Risk" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "bg-[#f59e0b]/15 text-[#f59e0b]"}`}>
                    {alt.feasibility}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-[#9ca3af] mb-3">⚠️ Risk Factors</h3>
            <div className="space-y-2">
              {goal.risks?.map((risk: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <AlertTriangle size={12} className={risk.severity === "high" ? "text-[#f43f5e]" : "text-[#f59e0b]"} />
                  <div>
                    <p className="text-white font-medium">{risk.factor}</p>
                    <p className="text-[10px] text-[#6b7280]">{risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
