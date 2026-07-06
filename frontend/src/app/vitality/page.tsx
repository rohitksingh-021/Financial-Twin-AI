"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchVitality } from "@/lib/api";
import { FALLBACK_VITALITY } from "@/lib/data";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUp, Target } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const subScoreNames: Record<string, string> = {
  income_stability: "Income Stability",
  savings_discipline: "Savings Discipline",
  investment_growth: "Investment Growth",
  debt_health: "Debt Health",
  liquidity_readiness: "Liquidity Readiness",
  risk_resilience: "Risk Resilience",
  goal_achievement: "Goal Achievement",
  financial_confidence: "Financial Confidence",
};

export default function VitalityPage() {
  const [data, setData] = useState<any>(null);
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    fetchVitality().then(setData).catch(() => setData(FALLBACK_VITALITY));
  }, []);

  useEffect(() => {
    if (!data) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setAnimScore(Math.round((1 - Math.pow(1 - p, 3)) * data.overall));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [data]);

  if (!data) return <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-[#4f8cff]/30 border-t-[#4f8cff] rounded-full animate-spin" /></div>;

  const radarData = Object.entries(data.sub_scores).map(([key, val]) => ({
    subject: subScoreNames[key] || key,
    value: val as number,
    fullMark: 100,
  }));

  const color = getScoreColor(data.overall);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animScore / 100) * circumference;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Financial Vitality Score™</h1>
        <p className="text-sm text-[#6b7280] mb-6">Your comprehensive financial health assessment</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-8 flex flex-col items-center">
          <div className="relative mb-4">
            <svg width="200" height="200" className="transform -rotate-90">
              <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle cx="100" cy="100" r={radius} fill="none" stroke={color} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${color}50)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color }}>{animScore}</span>
              <span className="text-sm text-[#6b7280]">{getScoreLabel(data.overall)}</span>
            </div>
          </div>

          {/* Peer benchmark */}
          <div className="w-full mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-xs text-[#6b7280] text-center">
              You&apos;re in the <span className="text-[#4f8cff] font-semibold">{data.peer_benchmark.percentile}th percentile</span> for age group {data.peer_benchmark.age_group}
            </p>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Financial DNA Radar</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Radar dataKey="value" stroke="#4f8cff" fill="#4f8cff" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#4f8cff", r: 4 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sub-scores detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {Object.entries(data.sub_scores).map(([key, val], i) => {
          const score = val as number;
          const scoreColor = getScoreColor(score);
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9ca3af]">{subScoreNames[key]}</span>
                <span className="text-lg font-bold" style={{ color: scoreColor }}>{score}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: scoreColor }} />
              </div>
              <p className="text-[10px] text-[#6b7280] leading-relaxed">{data.explanations?.[key] || data.labels?.[key]}</p>
            </motion.div>
          );
        })}
      </div>

      {/* History + Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Score History</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis domain={[60, 85]} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,22,56,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "#f0f0f5" }} />
                <Line type="monotone" dataKey="score" stroke="#4f8cff" strokeWidth={2} dot={{ fill: "#4f8cff", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">🚀 Top Improvements</h3>
          <div className="space-y-4">
            {data.improvements?.map((imp: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={14} className="text-[#4f8cff]" />
                  <span className="text-sm font-medium text-white">{imp.title}</span>
                </div>
                <p className="text-[10px] text-[#6b7280] mb-2">{imp.description}</p>
                <div className="flex items-center gap-2 text-[10px]">
                  <ArrowUp size={10} className="text-[#10b981]" />
                  <span className="text-[#10b981]">+{imp.potential_impact} points potential</span>
                  <span className="text-[#6b7280]">• Current: {imp.current_score}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
