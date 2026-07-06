"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const severityConfig: Record<string, { icon: any; cls: string }> = {
  high: { icon: ShieldAlert, cls: "badge-high" },
  medium: { icon: AlertTriangle, cls: "badge-medium" },
  low: { icon: Info, cls: "badge-low" },
};

export default function RiskAlerts({ alerts }: { alerts: any[] }) {
  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">⚠️ Risk Alerts</h3>

      <div className="space-y-3">
        {alerts.map((alert: any, i: number) => {
          const config = severityConfig[alert.severity] || severityConfig.low;
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className={`p-1.5 rounded-lg ${config.cls}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">{alert.title}</p>
                <p className="text-[10px] text-[#6b7280] mt-0.5">{alert.description}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium uppercase ${config.cls}`}>
                {alert.severity}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
