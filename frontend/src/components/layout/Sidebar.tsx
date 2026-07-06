"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HeartPulse,
  Users,
  Navigation,
  FlaskConical,
  MessageCircle,
  ShieldAlert,
  BrainCircuit,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchCustomer } from "@/lib/api";
import DataInputPanel from "@/components/data-input/DataInputPanel";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vitality", label: "Vitality Score", icon: HeartPulse },
  { href: "/twin", label: "Financial Twin", icon: Users },
  { href: "/wealth-gps", label: "Wealth GPS", icon: Navigation },
  { href: "/simulator", label: "Simulator", icon: FlaskConical },
  { href: "/advisor", label: "AI Advisor", icon: MessageCircle },
  { href: "/stress-monitor", label: "Stress Monitor", icon: ShieldAlert },
  { href: "/life-events", label: "Life Events", icon: BrainCircuit },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showDataInput, setShowDataInput] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userInitials, setUserInitials] = useState("GU");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    fetchCustomer()
      .then((data) => {
        if (data?.profile?.name) {
          setUserName(data.profile.name);
          const parts = data.profile.name.split(" ");
          setUserInitials(
            parts.length >= 2
              ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
              : parts[0].slice(0, 2).toUpperCase()
          );
          if (data.profile.account_number) {
            setAccountNumber(`•••${data.profile.account_number.slice(-4)}`);
          }
        }
      })
      .catch(() => {
        // Backend not available, keep defaults
      });
  }, []);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[260px] glass-card-static border-r border-r-white/[0.06] flex flex-col z-50 rounded-none">
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f8cff] to-[#7c3aed] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              FT
            </div>
            <div>
              <h1 className="text-sm font-bold gradient-text-blue">Financial Twin AI</h1>
              <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">Digital Banking</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${active ? "active" : ""}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* My Profile Button */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => setShowDataInput(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#10b981]/20 to-[#4f8cff]/20 border border-[#10b981]/30 text-[#10b981] hover:from-[#10b981]/30 hover:to-[#4f8cff]/30 transition-all duration-200 text-sm font-semibold"
          >
            <User size={18} />
            <span>My Profile</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 bg-[#10b981]/20 rounded-full">Edit</span>
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#00d4ff] flex items-center justify-center text-white text-xs font-bold">
              {userInitials}
            </div>
            <div>
              <p className="text-xs font-medium text-white/90">{userName}</p>
              {accountNumber && (
                <p className="text-[10px] text-[#6b7280]">A/C: {accountNumber}</p>
              )}
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#10b981] pulse-green-anim" />
          </div>
        </div>
      </aside>

      {/* Data Input Panel */}
      {showDataInput && (
        <DataInputPanel onClose={() => setShowDataInput(false)} />
      )}
    </>
  );
}
