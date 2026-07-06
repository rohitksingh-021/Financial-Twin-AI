"use client";

import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function FinancialTwinCard({ data }: { data: any }) {
  const current = data.current;
  const projection = data.projection_1yr;

  const metrics = [
    { label: "Net Worth", current: current.net_worth ?? 0, future: projection.net_worth ?? 0 },
    { label: "Monthly Income", current: current.monthly_income ?? 0, future: projection.monthly_income ?? 0 },
    { label: "Monthly Expenses", current: current.monthly_expenses ?? 0, future: projection.monthly_expenses ?? 0 },
    { label: "Total Investments", current: current.total_investments ?? 0, future: projection.total_investments ?? 0 },
    { label: "Total Debt", current: current.total_debt ?? 0, future: projection.total_debt ?? 0 },
  ];

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#9ca3af]">Financial Digital Twin</h3>
          <p className="text-[10px] text-[#6b7280] mt-0.5">Your financial mirror — now vs 1 year projection</p>
        </div>
        <Link href="/twin" className="text-xs text-[#4f8cff] hover:text-[#4f8cff]/80 flex items-center gap-1">
          Explore <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-[#4f8cff]/10 to-transparent border border-[#4f8cff]/10">
          <p className="text-[10px] text-[#4f8cff] font-medium mb-1">NOW</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(current.net_worth)}</p>
          <p className="text-[10px] text-[#6b7280]">Net Worth</p>
        </div>
        <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-[#10b981]/10 to-transparent border border-[#10b981]/10">
          <p className="text-[10px] text-[#10b981] font-medium mb-1">1 YEAR</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(projection.net_worth)}</p>
          <p className="text-[10px] text-[#6b7280]">Projected Net Worth</p>
        </div>
      </div>

      <div className="space-y-2">
        {metrics.slice(1).map((m) => {
          const delta = m.future - m.current;
          const isPositive = (m.label === "Total Debt" || m.label === "Monthly Expenses") ? delta <= 0 : delta >= 0;
          return (
            <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-xs text-[#9ca3af]">{m.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#6b7280]">{formatCurrency(m.current)}</span>
                <span className="text-[#6b7280]">→</span>
                <span className="text-xs font-medium text-white">{formatCurrency(m.future)}</span>
                <span className={`text-[10px] flex items-center gap-0.5 ${isPositive ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
                  {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {formatCurrency(Math.abs(delta))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
