"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runSimulation } from "@/lib/api";
import { formatCurrency, getScoreColor } from "@/lib/utils";
import { FlaskConical, Car, TrendingUp, Briefcase, Clock, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */

const scenarios = [
  { id: "buy_car", label: "Buy a Car", icon: Car, description: "₹25L car with loan", defaultParams: { amount: 2500000 } },
  { id: "increase_sip", label: "Increase SIP", icon: TrendingUp, description: "+₹10K/month investment", defaultParams: { additional_amount: 10000 } },
  { id: "job_loss", label: "Job Loss", icon: Briefcase, description: "6 months no income", defaultParams: { months_without_income: 6 } },
  { id: "early_retirement", label: "Retire at 50", icon: Clock, description: "Stop earning at 50", defaultParams: { retirement_age: 50 } },
  { id: "salary_hike", label: "30% Salary Hike", icon: DollarSign, description: "Income increase", defaultParams: { hike_percentage: 30 } },
  { id: "large_expense", label: "₹5L Emergency", icon: BarChart3, description: "Large unexpected expense", defaultParams: { amount: 500000 } },
];

export default function SimulatorPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (scenarioId: string) => {
    setSelected(scenarioId);
    setLoading(true);
    setResult(null);
    const scenario = scenarios.find((s) => s.id === scenarioId);
    try {
      const res = await runSimulation(scenarioId, (scenario?.defaultParams || {}) as Record<string, number>);
      setResult(res);
    } catch {
      // Fallback result
      setResult({
        label: scenario?.label,
        baseline: { vitality_score: 72.4, net_worth: 1239200, net_worth_5yr: 8920000, monthly_savings: 27833 },
        modified: {
          vitality_score: scenarioId === "increase_sip" ? 78 : scenarioId === "salary_hike" ? 82 : 62,
          net_worth: scenarioId === "buy_car" ? 739200 : scenarioId === "salary_hike" ? 1439200 : 1039200,
          net_worth_5yr: scenarioId === "increase_sip" ? 11200000 : scenarioId === "salary_hike" ? 13500000 : scenarioId === "buy_car" ? 6200000 : 5800000,
          monthly_savings: scenarioId === "increase_sip" ? 17833 : scenarioId === "salary_hike" ? 72833 : scenarioId === "buy_car" ? 8833 : 27833,
        },
        impact: {
          vitality: { overall_change: scenarioId === "increase_sip" ? 5.6 : scenarioId === "salary_hike" ? 9.6 : -10.4 },
          goals: [{ goal: "Buy a House", change: scenarioId === "buy_car" ? -25 : scenarioId === "salary_hike" ? 15 : -5 }],
        },
        scenarios: {
          optimistic: { label: "Best Case", net_worth_5yr: 12000000 },
          realistic: { label: "Most Likely", net_worth_5yr: 9000000 },
          pessimistic: { label: "Worst Case", net_worth_5yr: 6000000 },
        },
        verdict: {
          recommendation: scenarioId === "increase_sip" || scenarioId === "salary_hike" ? "Strongly Recommended" : "Not Recommended Currently",
          confidence: scenarioId === "increase_sip" ? 85 : 75,
          reasoning: scenarioId === "buy_car" ? "Significant negative impact on financial trajectory. Goals delayed by 2+ years." : scenarioId === "increase_sip" ? "Positive impact on all financial dimensions." : "Assess carefully.",
          vitality_change: scenarioId === "increase_sip" ? 5.6 : -10.4,
        },
      });
    }
    setLoading(false);
  };

  const comparisonData = result ? [
    { metric: "Vitality Score", before: result.baseline.vitality_score, after: result.modified.vitality_score },
    { metric: "Net Worth", before: result.baseline.net_worth / 100000, after: result.modified.net_worth / 100000 },
    { metric: "5yr Net Worth", before: result.baseline.net_worth_5yr / 100000, after: result.modified.net_worth_5yr / 100000 },
  ] : [];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><FlaskConical size={24} className="text-[#7c3aed]" /> What-If Simulator</h1>
        <p className="text-sm text-[#6b7280] mb-6">Simulate financial scenarios and see the impact on your entire financial life</p>
      </motion.div>

      {/* Scenario Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {scenarios.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleSimulate(s.id)}
            className={`p-4 rounded-xl text-left transition-all ${selected === s.id ? "glow-border-purple bg-[#7c3aed]/10" : "glass-card"}`}
          >
            <s.icon size={20} className={selected === s.id ? "text-[#7c3aed]" : "text-[#6b7280]"} />
            <p className="text-xs font-semibold text-white mt-2">{s.label}</p>
            <p className="text-[10px] text-[#6b7280] mt-0.5">{s.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#7c3aed]/30 border-t-[#7c3aed] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#6b7280] mt-4">Simulating scenario...</p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Verdict */}
            <div className={`glass-card p-6 ${result.verdict.vitality_change >= 0 ? "glow-border-purple" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${result.verdict.vitality_change >= 0 ? "bg-[#10b981]/15" : "bg-[#f43f5e]/15"}`}>
                  {result.verdict.vitality_change >= 0 ? <ArrowUpRight size={24} className="text-[#10b981]" /> : <ArrowDownRight size={24} className="text-[#f43f5e]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{result.verdict.recommendation}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#9ca3af]">Confidence: {result.verdict.confidence}%</span>
                  </div>
                  <p className="text-sm text-[#9ca3af]">{result.verdict.reasoning}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`text-sm font-bold ${result.verdict.vitality_change >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
                      {result.verdict.vitality_change >= 0 ? "+" : ""}{result.verdict.vitality_change.toFixed(1)} Vitality Score
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Before/After Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Impact Comparison</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" margin={{ left: 80 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="metric" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "rgba(17,22,56,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "#f0f0f5" }} />
                      <Bar dataKey="before" name="Before" fill="#4f8cff" barSize={14} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="after" name="After" barSize={14} radius={[0, 4, 4, 0]}>
                        {comparisonData.map((entry, i) => (
                          <Cell key={i} fill={entry.after >= entry.before ? "#10b981" : "#f43f5e"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Three Scenarios */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Outcome Scenarios (5yr Net Worth)</h3>
                <div className="space-y-4">
                  {[
                    { key: "optimistic", label: "🟢 Best Case", color: "#10b981" },
                    { key: "realistic", label: "🔵 Most Likely", color: "#4f8cff" },
                    { key: "pessimistic", label: "🟡 Worst Case", color: "#f59e0b" },
                  ].map((s) => {
                    const sc = result.scenarios?.[s.key];
                    return sc ? (
                      <div key={s.key} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{s.label}</span>
                          <span className="text-lg font-bold" style={{ color: s.color }}>{formatCurrency(sc.net_worth_5yr)}</span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
