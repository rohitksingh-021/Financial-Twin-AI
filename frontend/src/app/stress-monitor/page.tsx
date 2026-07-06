"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchStress } from "@/lib/api";
import { FALLBACK_STRESS } from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

function getStressColor(level: number): string {
  if (level <= 20) return "#10b981";
  if (level <= 40) return "#4f8cff";
  if (level <= 60) return "#f59e0b";
  if (level <= 80) return "#f97316";
  return "#f43f5e";
}

function getStressLabel(status: string): { label: string; description: string } {
  switch (status) {
    case "Low":
      return { label: "Low Stress", description: "Your finances are in great shape!" };
    case "Moderate":
      return { label: "Moderate Stress", description: "Some areas need attention." };
    case "Elevated":
      return { label: "Elevated Stress", description: "Multiple risk factors detected." };
    case "High":
      return { label: "High Stress", description: "Immediate action recommended." };
    case "Critical":
      return { label: "Critical Stress", description: "Urgent financial intervention needed." };
    default:
      return { label: "Unknown", description: "No data available." };
  }
}

function getSeverityIcon(severity: string) {
  if (severity === "high")
    return <AlertTriangle size={16} className="text-[#f43f5e]" />;
  if (severity === "medium")
    return <AlertTriangle size={16} className="text-[#f59e0b]" />;
  return <Activity size={16} className="text-[#4f8cff]" />;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "debt":
      return <TrendingDown size={14} className="text-[#f43f5e]" />;
    case "expense":
      return <Zap size={14} className="text-[#f59e0b]" />;
    case "savings":
      return <Shield size={14} className="text-[#4f8cff]" />;
    case "income":
      return <TrendingUp size={14} className="text-[#10b981]" />;
    case "protection":
      return <ShieldAlert size={14} className="text-[#7c3aed]" />;
    default:
      return <CheckCircle size={14} className="text-[#9ca3af]" />;
  }
}

export default function StressMonitorPage() {
  const [data, setData] = useState<any>(null);
  const [animLevel, setAnimLevel] = useState(0);

  useEffect(() => {
    fetchStress()
      .then(setData)
      .catch(() => setData(FALLBACK_STRESS));
  }, []);

  useEffect(() => {
    if (!data) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimLevel(Math.round(eased * data.current_level * 10) / 10);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [data]);

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#f43f5e]/30 border-t-[#f43f5e] rounded-full animate-spin" />
      </div>
    );

  const color = getStressColor(data.current_level);
  const { label, description } = getStressLabel(data.status);

  // Gauge arc calculations
  const radius = 90;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - (animLevel / 100) * circumference;

  // Projection data for bar-like display
  const projections = [
    { label: "30 Days", value: data.projections["30_day"], key: "30d" },
    { label: "90 Days", value: data.projections["90_day"], key: "90d" },
    { label: "1 Year", value: data.projections["365_day"], key: "365d" },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <ShieldAlert size={24} className="text-[#f43f5e]" /> Financial Stress
          Monitor
        </h1>
        <p className="text-sm text-[#6b7280] mb-6">
          Real-time detection of financial stress signals with predictive
          analytics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stress Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 flex flex-col items-center"
        >
          {/* Semi-circular gauge */}
          <div className="relative mb-2">
            <svg width="220" height="130" viewBox="0 0 220 130">
              {/* Background arc */}
              <path
                d="M 20 120 A 90 90 0 0 1 200 120"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Colored arc */}
              <path
                d="M 20 120 A 90 90 0 0 1 200 120"
                fill="none"
                stroke={color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={offset}
                style={{ filter: `drop-shadow(0 0 12px ${color}50)`, transition: "stroke-dashoffset 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <span
                className="text-5xl font-bold"
                style={{ color }}
              >
                {animLevel.toFixed(0)}
              </span>
              <span className="text-xs text-[#6b7280] mt-1">/ 100</span>
            </div>
          </div>

          {/* Status label */}
          <div className="text-center mt-3">
            <p className="text-lg font-bold" style={{ color }}>
              {label}
            </p>
            <p className="text-xs text-[#6b7280] mt-1">{description}</p>
          </div>

          {/* Scale legend */}
          <div className="w-full mt-5 flex items-center gap-1">
            {[
              { range: "0-20", color: "#10b981", label: "Low" },
              { range: "21-40", color: "#4f8cff", label: "Moderate" },
              { range: "41-60", color: "#f59e0b", label: "Elevated" },
              { range: "61-80", color: "#f97316", label: "High" },
              { range: "81-100", color: "#f43f5e", label: "Critical" },
            ].map((s) => (
              <div key={s.range} className="flex-1 text-center">
                <div
                  className="h-1.5 rounded-full mb-1"
                  style={{ backgroundColor: s.color, opacity: 0.5 }}
                />
                <span className="text-[8px] text-[#6b7280]">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stress Signals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">
            ⚡ Active Stress Signals
          </h3>

          {data.signals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={40} className="text-[#10b981] mb-3" />
              <p className="text-sm text-white font-medium">
                No stress signals detected!
              </p>
              <p className="text-xs text-[#6b7280] mt-1">
                Your finances look healthy.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.signals.map((signal: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`p-4 rounded-xl border ${
                    signal.severity === "high"
                      ? "bg-[#f43f5e]/5 border-[#f43f5e]/20"
                      : signal.severity === "medium"
                      ? "bg-[#f59e0b]/5 border-[#f59e0b]/20"
                      : "bg-white/[0.02] border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getSeverityIcon(signal.severity)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          {signal.title}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                            signal.severity === "high"
                              ? "badge-high"
                              : signal.severity === "medium"
                              ? "badge-medium"
                              : "badge-low"
                          }`}
                        >
                          {signal.severity}
                        </span>
                      </div>
                      <p className="text-xs text-[#9ca3af] leading-relaxed">
                        {signal.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold" style={{ color: getStressColor(signal.weight * 3) }}>
                        +{signal.weight}
                      </span>
                      <p className="text-[9px] text-[#6b7280]">weight</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Row 2: Projections + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Projections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">
            📊 Stress Projections
          </h3>

          <div className="space-y-4">
            {projections.map((proj, i) => {
              const projColor = getStressColor(proj.value);
              const change = proj.value - data.current_level;
              return (
                <motion.div
                  key={proj.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#9ca3af]">
                      {proj.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color: projColor }}
                      >
                        {proj.value.toFixed(1)}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                          change > 0
                            ? "bg-[#f43f5e]/10 text-[#f43f5e]"
                            : change < 0
                            ? "bg-[#10b981]/10 text-[#10b981]"
                            : "bg-white/5 text-[#9ca3af]"
                        }`}
                      >
                        {change > 0 ? "↑" : change < 0 ? "↓" : "→"}{" "}
                        {Math.abs(change).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(proj.value, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: projColor }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Current vs projected summary */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-[#4f8cff]" />
              <span className="text-xs font-medium text-white">
                Trend Analysis
              </span>
            </div>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              {data.projections["365_day"] > data.current_level + 5
                ? "⚠️ Stress levels are projected to increase. Consider taking preventive actions soon."
                : data.projections["365_day"] < data.current_level - 5
                ? "✅ Stress levels are projected to decrease. Your financial health is improving."
                : "→ Stress levels are expected to remain relatively stable. Monitor regularly."}
            </p>
          </div>
        </motion.div>

        {/* History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">
            📈 Stress Level History
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history}>
                <defs>
                  <linearGradient
                    id="stressGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={color}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor={color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  domain={[0, 50]}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(17,22,56,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#f0f0f5",
                  }}
                  formatter={(v: any) => [`${Number(v).toFixed(1)}`, "Stress Level"]}
                />
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke={color}
                  fill="url(#stressGrad)"
                  strokeWidth={2}
                  dot={{ fill: color, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: "#0a0e27" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Preventive Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 mt-6"
      >
        <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">
          🛡️ Preventive Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.preventive_actions.map((action: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(action.category)}
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                    action.priority === "high"
                      ? "badge-high"
                      : action.priority === "medium"
                      ? "badge-medium"
                      : "badge-low"
                  }`}
                >
                  {action.priority}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-[#4f8cff] transition-colors">
                {action.title}
              </h4>
              <p className="text-[11px] text-[#6b7280] leading-relaxed mb-3">
                {action.description}
              </p>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Zap size={10} className="text-[#f59e0b]" />
                <span className="text-[#f59e0b]">{action.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
