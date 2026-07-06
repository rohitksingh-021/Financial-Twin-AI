"use client";

import { useState, useEffect } from "react";
import { X, RotateCcw, Rocket, Plus, Trash2, User, Download } from "lucide-react";
import { setCustomer, resetCustomer, fetchCustomer } from "@/lib/api";

interface Props {
  onClose: () => void;
}

const emptyProfile = {
  name: "", age: 25, gender: "Male",
  occupation: "", employer: "",
  annual_income: 0, monthly_income: 0, city: "",
  family_size: 1, dependents: 0, risk_appetite: "moderate",
  pan_number: "", account_number: "",
};

const emptyMonthly = {
  month: "", income: 0, rent: 0, groceries: 0, utilities: 0,
  transport: 0, entertainment: 0, healthcare: 0, education: 0,
  shopping: 0, emi_total: 0, investments: 0, other: 0,
};

export default function DataInputPanel({ onClose }: Props) {
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [status, setStatus] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);

  const [profile, setProfile] = useState({ ...emptyProfile });

  const [goals, setGoals] = useState<Array<{
    id: string; name: string; target_amount: number;
    current_amount: number; deadline: string; priority: number;
  }>>([]);

  const [investments, setInvestments] = useState<Array<{
    id: string; type: string; name: string; invested_amount: number;
    current_value: number; start_date: string; expected_return: number;
  }>>([]);

  const [loans, setLoans] = useState<Array<{
    id: string; type: string; principal: number; outstanding: number;
    emi: number; tenure_remaining: number; interest_rate: number;
  }>>([]);

  const [insurance, setInsurance] = useState<Array<{
    id: string; type: string; provider: string; sum_assured: number;
    annual_premium: number; expiry_date: string;
  }>>([]);

  const [monthlyFinancials, setMonthlyFinancials] = useState<Array<{
    month: string; income: number; rent: number; groceries: number;
    utilities: number; transport: number; entertainment: number;
    healthcare: number; education: number; shopping: number;
    emi_total: number; investments: number; other: number;
  }>>([]);

  // Try loading existing data from backend on mount
  useEffect(() => {
    fetchCustomer()
      .then((data) => {
        if (data && data.profile && data.profile.name) {
          setProfile(data.profile);
          setGoals(data.goals || []);
          setInvestments(data.investments || []);
          setLoans(data.loans || []);
          setInsurance(data.insurance || []);
          setMonthlyFinancials(data.monthly_financials || []);
          setHasExistingData(true);
        }
      })
      .catch(() => {
        // Backend not available, keep empty form
      })
      .finally(() => setLoadingExisting(false));
  }, []);

  const tabs = [
    { key: "profile", label: "👤 Profile" },
    { key: "monthly", label: "📊 Monthly" },
    { key: "investments", label: "📈 Investments" },
    { key: "loans", label: "🏦 Loans" },
    { key: "insurance", label: "🛡️ Insurance" },
    { key: "goals", label: "🎯 Goals" },
  ];

  const handleSubmit = async () => {
    if (!profile.name.trim()) {
      setStatus("⚠️ Please enter your name first.");
      return;
    }
    if (profile.monthly_income <= 0 && profile.annual_income <= 0) {
      setStatus("⚠️ Please enter your income.");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      // Auto-calculate monthly if only annual given, and vice versa
      const p = { ...profile };
      if (p.annual_income > 0 && p.monthly_income <= 0) p.monthly_income = Math.round(p.annual_income / 12);
      if (p.monthly_income > 0 && p.annual_income <= 0) p.annual_income = p.monthly_income * 12;

      const payload = {
        profile: p,
        monthly_financials: monthlyFinancials,
        investments,
        loans,
        insurance,
        goals,
        transactions: [],
      };
      await setCustomer(payload);
      setStatus(`✅ Financial Twin built for ${p.name}!`);
      setHasExistingData(true);
      setTimeout(() => { window.location.reload(); }, 1500);
    } catch {
      setStatus("⚠️ Backend not connected. Please start the backend server.");
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetCustomer();
      setStatus("✅ Reset to default profile!");
      setTimeout(() => { window.location.reload(); }, 1000);
    } catch {
      setStatus("⚠️ Backend not connected.");
    }
    setLoading(false);
  };

  const handleClearForm = () => {
    setProfile({ ...emptyProfile });
    setGoals([]);
    setInvestments([]);
    setLoans([]);
    setInsurance([]);
    setMonthlyFinancials([]);
    setHasExistingData(false);
    setStatus("Form cleared. Enter your financial data.");
  };

  const addMonthlyRow = () => {
    const lastMonth = monthlyFinancials.length > 0
      ? monthlyFinancials[monthlyFinancials.length - 1].month
      : "";
    let nextMonth = "";
    if (lastMonth) {
      const [y, m] = lastMonth.split("-").map(Number);
      const nm = m === 12 ? 1 : m + 1;
      const ny = m === 12 ? y + 1 : y;
      nextMonth = `${ny}-${String(nm).padStart(2, "0")}`;
    } else {
      const now = new Date();
      nextMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }
    setMonthlyFinancials([...monthlyFinancials, { ...emptyMonthly, month: nextMonth, income: profile.monthly_income || 0 }]);
  };

  if (loadingExisting) {
    return (
      <div className="fixed inset-0 z-[100] flex">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute right-0 top-0 h-full w-[640px] bg-[#0d1230] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#4f8cff]/30 border-t-[#4f8cff] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-[640px] bg-[#0d1230] border-l border-white/10 animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold gradient-text-blue flex items-center gap-2">
              <User size={20} /> My Financial Profile
            </h2>
            <p className="text-xs text-[#6b7280] mt-1">
              {hasExistingData
                ? `Editing ${profile.name}'s profile — update and rebuild your twin`
                : "Enter your financial data to build your personalized Financial Twin"
              }
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-[#6b7280] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3 border-b border-white/[0.06] overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                tab === t.key
                  ? "bg-[#4f8cff]/20 text-[#4f8cff] border border-[#4f8cff]/30"
                  : "text-[#6b7280] hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "profile" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#4f8cff]/5 border border-[#4f8cff]/10">
                <p className="text-[11px] text-[#9ca3af]">
                  💡 Start by entering your basic details. Your name and income are required — everything else helps improve accuracy.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(profile).map(([key, value]) => (
                  <div key={key} className={key === "name" || key === "employer" || key === "occupation" ? "col-span-2" : ""}>
                    <label className="text-xs text-[#9ca3af] block mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                      {(key === "name" || key === "monthly_income") && <span className="text-[#f43f5e] ml-1">*</span>}
                    </label>
                    {key === "risk_appetite" ? (
                      <select
                        className="input-field"
                        value={String(value)}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      >
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                      </select>
                    ) : key === "gender" ? (
                      <select
                        className="input-field"
                        value={String(value)}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        className="input-field"
                        type={typeof value === "number" ? "number" : "text"}
                        value={value || ""}
                        placeholder={key === "name" ? "e.g. Priya Mehta" : key === "city" ? "e.g. Mumbai" : key === "occupation" ? "e.g. Software Engineer" : key === "employer" ? "e.g. Infosys" : ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            [key]: typeof value === "number" ? Number(e.target.value) : e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "monthly" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#4f8cff]/5 border border-[#4f8cff]/10">
                <p className="text-[11px] text-[#9ca3af]">
                  💡 Add your monthly income and expense data. More months = better analysis. Click "Add Month" to start.
                </p>
              </div>
              {monthlyFinancials.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[#6b7280] mb-4">No monthly data yet</p>
                  <button onClick={addMonthlyRow} className="px-6 py-3 rounded-xl bg-[#4f8cff]/15 border border-[#4f8cff]/25 text-[#4f8cff] text-sm font-medium hover:bg-[#4f8cff]/25 transition-all flex items-center gap-2 mx-auto">
                    <Plus size={16} /> Add Your First Month
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-[#6b7280]">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Income</th>
                          <th className="text-right p-2">Rent</th>
                          <th className="text-right p-2">Groceries</th>
                          <th className="text-right p-2">EMIs</th>
                          <th className="text-right p-2">Invest</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyFinancials.map((mf, i) => (
                          <tr key={i} className="border-t border-white/[0.04]">
                            <td className="p-1">
                              <input
                                type="month"
                                className="input-field text-xs py-1 px-2"
                                value={mf.month}
                                onChange={(e) => {
                                  const updated = [...monthlyFinancials];
                                  updated[i] = { ...updated[i], month: e.target.value };
                                  setMonthlyFinancials(updated);
                                }}
                              />
                            </td>
                            {(["income", "rent", "groceries", "emi_total", "investments"] as const).map((field) => (
                              <td key={field} className="p-1">
                                <input
                                  type="number"
                                  className="input-field text-right text-xs py-1 px-2"
                                  value={mf[field] || ""}
                                  placeholder="0"
                                  onChange={(e) => {
                                    const updated = [...monthlyFinancials];
                                    updated[i] = { ...updated[i], [field]: Number(e.target.value) };
                                    setMonthlyFinancials(updated);
                                  }}
                                />
                              </td>
                            ))}
                            <td className="p-1">
                              <button onClick={() => setMonthlyFinancials(monthlyFinancials.filter((_, j) => j !== i))} className="text-[#f43f5e]/60 hover:text-[#f43f5e] p-1">
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={addMonthlyRow} className="w-full py-2 rounded-lg border border-dashed border-white/10 text-[#6b7280] hover:text-white hover:border-white/20 transition-colors text-xs flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Month
                  </button>
                </>
              )}
            </div>
          )}

          {tab === "investments" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#4f8cff]/5 border border-[#4f8cff]/10">
                <p className="text-[11px] text-[#9ca3af]">
                  💡 Add your investment portfolio — mutual funds, FDs, stocks, PPF, NPS, gold, etc.
                </p>
              </div>
              {investments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#6b7280] mb-4">No investments added yet</p>
                </div>
              )}
              {investments.map((inv, i) => (
                <div key={inv.id} className="glass-card-static p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#4f8cff] font-medium">Investment {i + 1}</span>
                    <button onClick={() => setInvestments(investments.filter((_, j) => j !== i))} className="text-[#f43f5e] hover:text-[#f43f5e]/80">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Type</label>
                      <select className="input-field text-xs" value={inv.type} onChange={(e) => { const u = [...investments]; u[i] = { ...u[i], type: e.target.value }; setInvestments(u); }}>
                        <option value="MF">Mutual Fund</option>
                        <option value="FD">FD</option>
                        <option value="stocks">Stocks</option>
                        <option value="PPF">PPF</option>
                        <option value="NPS">NPS</option>
                        <option value="gold">Gold</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Name</label>
                      <input className="input-field text-xs" placeholder="e.g. HDFC Mid-Cap Fund" value={inv.name} onChange={(e) => { const u = [...investments]; u[i] = { ...u[i], name: e.target.value }; setInvestments(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Invested (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={inv.invested_amount || ""} onChange={(e) => { const u = [...investments]; u[i] = { ...u[i], invested_amount: Number(e.target.value) }; setInvestments(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Current Value (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={inv.current_value || ""} onChange={(e) => { const u = [...investments]; u[i] = { ...u[i], current_value: Number(e.target.value) }; setInvestments(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Start Date</label>
                      <input className="input-field text-xs" type="date" value={inv.start_date} onChange={(e) => { const u = [...investments]; u[i] = { ...u[i], start_date: e.target.value }; setInvestments(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Expected Return (%)</label>
                      <input className="input-field text-xs" type="number" step="0.1" placeholder="12" value={inv.expected_return || ""} onChange={(e) => { const u = [...investments]; u[i] = { ...u[i], expected_return: Number(e.target.value) }; setInvestments(u); }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setInvestments([...investments, { id: `i${Date.now()}`, type: "MF", name: "", invested_amount: 0, current_value: 0, start_date: new Date().toISOString().slice(0, 10), expected_return: 12 }])} className="w-full py-2 rounded-lg border border-dashed border-white/10 text-[#6b7280] hover:text-white hover:border-white/20 transition-colors text-xs flex items-center justify-center gap-2">
                <Plus size={14} /> Add Investment
              </button>
            </div>
          )}

          {tab === "loans" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/10">
                <p className="text-[11px] text-[#9ca3af]">
                  💡 Add any active loans — personal, home, car, education. Leave empty if you have none.
                </p>
              </div>
              {loans.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#6b7280] mb-2">No loans added</p>
                  <p className="text-[11px] text-[#6b7280]">Great if you&apos;re debt-free! 🎉</p>
                </div>
              )}
              {loans.map((loan, i) => (
                <div key={loan.id} className="glass-card-static p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#f59e0b] font-medium">Loan {i + 1}</span>
                    <button onClick={() => setLoans(loans.filter((_, j) => j !== i))} className="text-[#f43f5e]"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Type</label>
                      <select className="input-field text-xs" value={loan.type} onChange={(e) => { const u = [...loans]; u[i] = { ...u[i], type: e.target.value }; setLoans(u); }}>
                        <option value="personal">Personal</option>
                        <option value="home">Home</option>
                        <option value="car">Car</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Principal (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={loan.principal || ""} onChange={(e) => { const u = [...loans]; u[i] = { ...u[i], principal: Number(e.target.value) }; setLoans(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Outstanding (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={loan.outstanding || ""} onChange={(e) => { const u = [...loans]; u[i] = { ...u[i], outstanding: Number(e.target.value) }; setLoans(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">EMI (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={loan.emi || ""} onChange={(e) => { const u = [...loans]; u[i] = { ...u[i], emi: Number(e.target.value) }; setLoans(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Remaining (months)</label>
                      <input className="input-field text-xs" type="number" placeholder="12" value={loan.tenure_remaining || ""} onChange={(e) => { const u = [...loans]; u[i] = { ...u[i], tenure_remaining: Number(e.target.value) }; setLoans(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Interest Rate (%)</label>
                      <input className="input-field text-xs" type="number" step="0.1" placeholder="10" value={loan.interest_rate || ""} onChange={(e) => { const u = [...loans]; u[i] = { ...u[i], interest_rate: Number(e.target.value) }; setLoans(u); }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setLoans([...loans, { id: `l${Date.now()}`, type: "personal", principal: 0, outstanding: 0, emi: 0, tenure_remaining: 12, interest_rate: 10 }])} className="w-full py-2 rounded-lg border border-dashed border-white/10 text-[#6b7280] hover:text-white hover:border-white/20 transition-colors text-xs flex items-center justify-center gap-2">
                <Plus size={14} /> Add Loan
              </button>
            </div>
          )}

          {tab === "insurance" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#7c3aed]/5 border border-[#7c3aed]/10">
                <p className="text-[11px] text-[#9ca3af]">
                  💡 Add your insurance policies — life, health, term, vehicle. Helps assess risk resilience.
                </p>
              </div>
              {insurance.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#6b7280] mb-2">No insurance policies added</p>
                  <p className="text-[11px] text-[#6b7280]">Adding insurance data improves risk analysis accuracy.</p>
                </div>
              )}
              {insurance.map((ins, i) => (
                <div key={ins.id} className="glass-card-static p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#7c3aed] font-medium">Policy {i + 1}</span>
                    <button onClick={() => setInsurance(insurance.filter((_, j) => j !== i))} className="text-[#f43f5e]"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Type</label>
                      <select className="input-field text-xs" value={ins.type} onChange={(e) => { const u = [...insurance]; u[i] = { ...u[i], type: e.target.value }; setInsurance(u); }}>
                        <option value="term">Term Life</option>
                        <option value="health">Health</option>
                        <option value="life">Life (Endowment)</option>
                        <option value="vehicle">Vehicle</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Provider</label>
                      <input className="input-field text-xs" placeholder="e.g. LIC, Star Health" value={ins.provider} onChange={(e) => { const u = [...insurance]; u[i] = { ...u[i], provider: e.target.value }; setInsurance(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Sum Assured (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={ins.sum_assured || ""} onChange={(e) => { const u = [...insurance]; u[i] = { ...u[i], sum_assured: Number(e.target.value) }; setInsurance(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Annual Premium (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={ins.annual_premium || ""} onChange={(e) => { const u = [...insurance]; u[i] = { ...u[i], annual_premium: Number(e.target.value) }; setInsurance(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Expiry Date</label>
                      <input className="input-field text-xs" type="date" value={ins.expiry_date} onChange={(e) => { const u = [...insurance]; u[i] = { ...u[i], expiry_date: e.target.value }; setInsurance(u); }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setInsurance([...insurance, { id: `ins${Date.now()}`, type: "term", provider: "", sum_assured: 0, annual_premium: 0, expiry_date: "" }])} className="w-full py-2 rounded-lg border border-dashed border-white/10 text-[#6b7280] hover:text-white hover:border-white/20 transition-colors text-xs flex items-center justify-center gap-2">
                <Plus size={14} /> Add Policy
              </button>
            </div>
          )}

          {tab === "goals" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#10b981]/5 border border-[#10b981]/10">
                <p className="text-[11px] text-[#9ca3af]">
                  💡 Add your financial goals — home purchase, emergency fund, retirement, travel, etc.
                </p>
              </div>
              {goals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#6b7280] mb-2">No goals added yet</p>
                  <p className="text-[11px] text-[#6b7280]">Add goals to unlock Wealth GPS tracking.</p>
                </div>
              )}
              {goals.map((goal, i) => (
                <div key={goal.id} className="glass-card-static p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#10b981] font-medium">Goal {i + 1}</span>
                    <button onClick={() => setGoals(goals.filter((_, j) => j !== i))} className="text-[#f43f5e]"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] text-[#6b7280] block mb-1">Goal Name</label>
                      <input className="input-field text-xs" placeholder="e.g. Buy a House" value={goal.name} onChange={(e) => { const u = [...goals]; u[i] = { ...u[i], name: e.target.value }; setGoals(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Target (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={goal.target_amount || ""} onChange={(e) => { const u = [...goals]; u[i] = { ...u[i], target_amount: Number(e.target.value) }; setGoals(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Saved So Far (₹)</label>
                      <input className="input-field text-xs" type="number" placeholder="0" value={goal.current_amount || ""} onChange={(e) => { const u = [...goals]; u[i] = { ...u[i], current_amount: Number(e.target.value) }; setGoals(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Deadline</label>
                      <input className="input-field text-xs" type="date" value={goal.deadline} onChange={(e) => { const u = [...goals]; u[i] = { ...u[i], deadline: e.target.value }; setGoals(u); }} />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#6b7280] block mb-1">Priority (1=highest)</label>
                      <input className="input-field text-xs" type="number" min="1" max="5" value={goal.priority} onChange={(e) => { const u = [...goals]; u[i] = { ...u[i], priority: Number(e.target.value) }; setGoals(u); }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setGoals([...goals, { id: `g${Date.now()}`, name: "", target_amount: 0, current_amount: 0, deadline: "2028-12-31", priority: goals.length + 1 }])} className="w-full py-2 rounded-lg border border-dashed border-white/10 text-[#6b7280] hover:text-white hover:border-white/20 transition-colors text-xs flex items-center justify-center gap-2">
                <Plus size={14} /> Add Goal
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        {status && (
          <div className="px-5 py-2">
            <p className="text-xs text-center">{status}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/[0.06] flex gap-3">
          <button
            onClick={handleClearForm}
            disabled={loading}
            className="px-3 py-3 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:bg-white/5 transition-all text-sm"
            title="Clear all form data"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-3 py-3 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:bg-white/5 transition-all text-sm"
            title="Reset to demo profile"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4f8cff] to-[#7c3aed] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Rocket size={16} />
            {loading ? "Building Your Twin..." : hasExistingData ? "🔄 Update Financial Twin" : "🚀 Build My Financial Twin"}
          </button>
        </div>
      </div>
    </div>
  );
}
