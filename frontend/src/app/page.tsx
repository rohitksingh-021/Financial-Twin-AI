"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchDashboard } from "@/lib/api";
import { FALLBACK_DASHBOARD } from "@/lib/data";
import VitalityScore from "@/components/dashboard/VitalityScore";
import FinancialTwinCard from "@/components/dashboard/FinancialTwinCard";
import LifeEventCards from "@/components/dashboard/LifeEventCards";
import GoalProgress from "@/components/dashboard/GoalProgress";
import HealthTimeline from "@/components/dashboard/HealthTimeline";
import RiskAlerts from "@/components/dashboard/RiskAlerts";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import AutonomousCoach from "@/components/dashboard/AutonomousCoach";

/* eslint-disable @typescript-eslint/no-explicit-any */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setData(FALLBACK_DASHBOARD));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#4f8cff]/30 border-t-[#4f8cff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="gradient-text-blue">{data.profile.name}</span>
        </h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Your Financial Twin is actively monitoring your finances • Last updated: just now
        </p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Row 1: Vitality Score + Twin Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeUp}>
            <VitalityScore data={data.vitality} />
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <FinancialTwinCard data={data.twin_snapshot} />
          </motion.div>
        </div>

        {/* Row 2: Life Events */}
        <motion.div variants={fadeUp}>
          <LifeEventCards events={data.life_events} />
        </motion.div>

        {/* Row 2.5: Autonomous Coach */}
        <motion.div variants={fadeUp}>
          <AutonomousCoach />
        </motion.div>

        {/* Row 3: Goals + Health Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeUp}>
            <GoalProgress goals={data.goals} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <HealthTimeline data={data.health_timeline} />
          </motion.div>
        </div>

        {/* Row 4: Risk Alerts + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeUp}>
            <RiskAlerts alerts={data.risk_alerts} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <AIRecommendations recommendations={data.recommendations} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
