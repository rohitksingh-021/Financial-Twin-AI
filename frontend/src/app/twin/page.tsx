"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTwin } from "@/lib/api";
import { FALLBACK_TWIN } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { Database, TrendingUp, Layers, Zap } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const PIE_COLORS = ["#4f8cff", "#7c3aed", "#10b981", "#f59e0b", "#00d4ff", "#f43f5e", "#8b5cf6"];

export default function TwinPage() {
  const [data, setData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState("5yr");

  useEffect(() => {
    fetchTwin().then(setData).catch(() => setData(FALLBACK_TWIN));
  }, []);

  if (!data) return <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-[#4f8cff]/30 border-t-[#4f8cff] rounded-full animate-spin" /></div>;

  const current = data.current_state;
  const projection = data.projections?.[timeframe] || {};
  const portfolio = current.investment_portfolio || [];

  // Merge trajectory data for chart
  const trajectoryData: any[] = [];
  const opt = data.trajectory?.optimistic || [];
  const real = data.trajectory?.realistic || [];
  const pess = data.trajectory?.pessimistic || [];
  for (let i = 0; i < real.length; i++) {
    trajectoryData.push({
      year: real[i]?.year?.toFixed(1),
      optimistic: opt[i]?.net_worth || 0,
      realistic: real[i]?.net_worth || 0,
      pessimistic: pess[i]?.net_worth || 0,
    });
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Financial Digital Twin</h1>
        <p className="text-sm text-[#6b7280] mb-6">Your living financial mirror — continuously evolving</p>
      </motion.div>

      {/* Current State Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Net Worth", value: current.net_worth, icon: Layers, color: "#4f8cff" },
          { label: "Monthly Income", value: current.monthly_income, icon: TrendingUp, color: "#10b981" },
          { label: "Total Investments", value: current.total_investments, icon: Zap, color: "#7c3aed" },
          { label: "Savings Rate", value: null, display: `${current.savings_rate}%`, icon: Database, color: "#00d4ff" },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <item.icon size={14} style={{ color: item.color }} />
              <span className="text-xs text-[#6b7280]">{item.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{item.display || formatCurrency(item.value!)}</p>
          </motion.div>
        ))}
      </div>

      {/* Projection Toggle + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#9ca3af]">Wealth Trajectory (3 Scenarios)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCurrency(v)} />
                <Tooltip contentStyle={{ background: "rgba(17,22,56,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "#f0f0f5" }} formatter={(v: any) => [formatCurrency(v)]} />
                <Area type="monotone" dataKey="optimistic" stroke="#10b981" fill="url(#optGrad)" strokeWidth={1.5} strokeDasharray="4 4" />
                <Area type="monotone" dataKey="realistic" stroke="#4f8cff" fill="url(#realGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="pessimistic" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-3 justify-center">
            {[{ label: "Optimistic", color: "#10b981" }, { label: "Realistic", color: "#4f8cff" }, { label: "Pessimistic", color: "#f59e0b" }].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-xs text-[#9ca3af]">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projection Summary */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Projection at</h3>
          <div className="flex gap-2 mb-4">
            {["1yr", "3yr", "5yr", "10yr"].map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${timeframe === tf ? "bg-[#4f8cff]/20 text-[#4f8cff] border border-[#4f8cff]/30" : "text-[#6b7280] hover:text-white"}`}>
                {tf}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { label: "Net Worth", value: projection.net_worth },
              { label: "Monthly Income", value: projection.monthly_income },
              { label: "Total Investments", value: projection.total_investments },
              { label: "Total Debt", value: projection.total_debt },
              { label: "Savings Rate", value: null, display: `${projection.savings_rate || 0}%` },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-xs text-[#6b7280]">{m.label}</span>
                <span className="text-sm font-semibold text-white">{m.display || formatCurrency(m.value || 0)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Portfolio + Data Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Investment Portfolio</h3>
          <div className="flex items-center gap-6">
            <div className="w-[160px] h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={portfolio} dataKey="value" nameKey="type" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {portfolio.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {portfolio.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-[#9ca3af] flex-1">{p.type.toUpperCase()}</span>
                  <span className="text-white font-medium">{formatCurrency(p.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">📡 Data Sources Feeding Your Twin</h3>
          <div className="grid grid-cols-2 gap-3">
            {(data.data_sources || []).map((src: any, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full bg-[#10b981] pulse-green-anim" />
                <div>
                  <p className="text-xs text-white">{src.name}</p>
                  <p className="text-[9px] text-[#6b7280]">{src.records} records</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
