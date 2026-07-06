"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function HealthTimeline({ data }: { data: any[] }) {
  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">📈 Financial Health Timeline</h3>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
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
              domain={[60, 85]}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(17, 22, 56, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
                color: "#f0f0f5",
              }}
              formatter={(value: any) => [`${Number(value).toFixed(1)}`, "Vitality Score"]}
              labelFormatter={(label: any) => `Month: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#4f8cff"
              strokeWidth={2}
              fill="url(#healthGradient)"
              dot={{ fill: "#4f8cff", r: 3, strokeWidth: 0 }}
              activeDot={{ fill: "#4f8cff", r: 5, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
