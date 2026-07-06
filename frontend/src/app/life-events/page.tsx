"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchLifeEvents } from "@/lib/api";
import { FALLBACK_DASHBOARD } from "@/lib/data";
import { formatCurrency, getScoreColor } from "@/lib/utils";
import { Calendar, BrainCircuit, Activity, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function LifeEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetchLifeEvents()
      .then(setEvents)
      .catch(() => setEvents(FALLBACK_DASHBOARD.life_events));
  }, []);

  if (!events.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#4f8cff]/30 border-t-[#4f8cff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <BrainCircuit size={24} className="text-[#10b981]" />
          Life Event Prediction Engine
        </h1>
        <p className="text-sm text-[#6b7280]">
          AI models analyzing your transaction velocity and behavioral signals to forecast major life milestones before they occur.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Events List */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-[#9ca3af] mb-4">Predicted Milestones</h3>
          {events.map((evt, idx) => {
            const isSelected = selectedEvent?.event === evt.event || (idx === 0 && !selectedEvent);
            if (idx === 0 && !selectedEvent) setSelectedEvent(evt);
            
            return (
              <motion.button
                key={evt.event}
                variants={fadeUp}
                onClick={() => setSelectedEvent(evt)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                  isSelected 
                    ? "glass-card border-[#10b981]/30 bg-[#10b981]/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                    : "glass-card-static hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                      {evt.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{evt.event}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-[#6b7280] mt-1">
                        <Calendar size={12} />
                        {evt.timeline}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold" style={{ color: getScoreColor(evt.probability) }}>
                      {evt.probability}%
                    </span>
                    <p className="text-[9px] text-[#6b7280] uppercase tracking-wider">Probability</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Right Column: Event Details */}
        {selectedEvent && (
          <motion.div
            key={selectedEvent.event}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Top Stat Card */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-3xl mb-4 border border-[#10b981]/20">
                    {selectedEvent.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.event}</h2>
                  <p className="text-[#9ca3af]">Estimated {selectedEvent.timeline}</p>
                </div>
                
                <div className="text-center p-4 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md">
                  <p className="text-sm text-[#6b7280] mb-1">AI Confidence</p>
                  <p className="text-4xl font-bold" style={{ color: getScoreColor(selectedEvent.probability) }}>
                    {selectedEvent.probability}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detection Signals */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity size={18} className="text-[#4f8cff]" />
                  <h3 className="text-sm font-semibold text-white">Detection Signals</h3>
                </div>
                <div className="space-y-4">
                  {selectedEvent.signals.map((signal: string, i: number) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4f8cff] mt-1.5 shrink-0 pulse-blue-anim" />
                      <p className="text-xs text-[#d1d5db] leading-relaxed">{signal}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Proactive Recommendations */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle size={18} className="text-[#f59e0b]" />
                  <h3 className="text-sm font-semibold text-white">Proactive Recommendations</h3>
                </div>
                
                {selectedEvent.recommendations?.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvent.recommendations.map((rec: string, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        key={i} 
                        className="p-4 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.06] hover:border-[#10b981]/30 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <ArrowRight size={14} className="text-[#10b981] mt-0.5 group-hover:translate-x-1 transition-transform" />
                          <p className="text-xs text-white group-hover:text-[#10b981] transition-colors leading-relaxed">{rec}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center pb-8">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <BrainCircuit size={20} className="text-[#6b7280]" />
                    </div>
                    <p className="text-sm text-[#9ca3af]">AI is gathering more data</p>
                    <p className="text-xs text-[#6b7280] mt-1">Recommendations will appear as event probability increases.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
