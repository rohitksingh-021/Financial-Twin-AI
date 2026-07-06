"use client";

import { motion } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LifeEventCards({ events }: { events: any[] }) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">🔮 Predicted Life Events</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {events.map((event: any, i: number) => (
          <motion.div
            key={event.event}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex-shrink-0 w-[280px] rounded-xl p-4 border ${
              event.probability > 70
                ? "bg-gradient-to-br from-[#4f8cff]/10 to-[#7c3aed]/5 border-[#4f8cff]/20 pulse-blue"
                : "bg-white/[0.03] border-white/[0.06]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{event.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{event.event}</p>
                  <p className="text-[10px] text-[#6b7280]">{event.timeline}</p>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                event.probability > 70 ? "bg-[#4f8cff]/20 text-[#4f8cff]" :
                event.probability > 40 ? "bg-[#f59e0b]/20 text-[#f59e0b]" :
                "bg-white/10 text-[#9ca3af]"
              }`}>
                {event.probability}%
              </div>
            </div>

            {/* Probability bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${event.probability}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                className="h-full rounded-full"
                style={{
                  background: event.probability > 70
                    ? "linear-gradient(90deg, #4f8cff, #7c3aed)"
                    : event.probability > 40
                    ? "linear-gradient(90deg, #f59e0b, #f97316)"
                    : "rgba(255,255,255,0.2)",
                }}
              />
            </div>

            {/* Signals */}
            {event.signals && event.signals.length > 0 && (
              <div className="space-y-1">
                {event.signals.slice(0, 3).map((signal: string, j: number) => (
                  <p key={j} className="text-[10px] text-[#6b7280] flex items-start gap-1.5">
                    <span className="text-[#4f8cff] mt-0.5">•</span>
                    {signal}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
