"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function VitalityScore({ data }: { data: any }) {
  const [animScore, setAnimScore] = useState(0);
  const score = data.overall;
  const color = getScoreColor(score);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animScore / 100) * circumference;

  const topScores = Object.entries(data.sub_scores as Record<string, number>)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#9ca3af]">Financial Vitality Score™</h3>
        <Link href="/vitality" className="text-xs text-[#4f8cff] hover:text-[#4f8cff]/80 flex items-center gap-1">
          Details <ArrowRight size={12} />
        </Link>
      </div>

      {/* Circular Gauge */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <svg width="170" height="170" className="transform -rotate-90">
            <circle cx="85" cy="85" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle
              cx="85" cy="85" r={radius} fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.1s linear", filter: `drop-shadow(0 0 8px ${color}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color }}>{animScore}</span>
            <span className="text-[10px] text-[#6b7280] mt-1">out of 100</span>
          </div>
        </div>
      </div>

      {/* Sub scores */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {topScores.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-[10px] text-[#6b7280] capitalize">{key.replace(/_/g, " ")}</p>
              <div className="h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${val}%`, backgroundColor: getScoreColor(val) }}
                />
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color: getScoreColor(val) }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
