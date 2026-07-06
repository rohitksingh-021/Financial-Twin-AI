/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fallback mock data for when backend is not available.
 * Mirrors the backend seed data for Rahul Sharma.
 */

export const FALLBACK_DASHBOARD: any = {
  profile: {
    name: "Rahul Sharma",
    age: 32,
    gender: "Male",
    occupation: "Senior Software Engineer",
    employer: "Tata Consultancy Services",
    annual_income: 1800000,
    monthly_income: 150000,
    city: "Mumbai",
    family_size: 3,
    dependents: 1,
    risk_appetite: "moderate",
  },
  vitality: {
    overall: 72.4,
    sub_scores: {
      income_stability: 88,
      savings_discipline: 71,
      investment_growth: 74,
      debt_health: 80,
      liquidity_readiness: 55,
      risk_resilience: 67,
      goal_achievement: 48,
      financial_confidence: 72,
    },
    labels: {
      income_stability: "Excellent",
      savings_discipline: "Strong",
      investment_growth: "Strong",
      debt_health: "Strong",
      liquidity_readiness: "Moderate",
      risk_resilience: "Moderate",
      goal_achievement: "Needs Attention",
      financial_confidence: "Strong",
    },
  },
  twin_snapshot: {
    current: {
      net_worth: 1239200,
      total_investments: 1689200,
      total_debt: 320000,
      monthly_income: 153333,
      monthly_expenses: 95500,
      monthly_savings: 27833,
      monthly_investments: 30000,
      savings_rate: 37.7,
    },
    projection_1yr: {
      net_worth: 2180000,
      monthly_income: 165600,
      monthly_expenses: 101230,
      total_investments: 2380000,
      total_debt: 140000,
    },
  },
  life_events: [
    { event: "Home Purchase", icon: "🏠", probability: 87, timeline: "within 6 months", signals: ["Property portal activity: MagicBricks Premium, 99acres Pro", "Furniture purchases detected", "Security deposit payment of ₹50,000", "Credit score inquiry detected", "Savings increased by 28% in recent months", "Active goal: Buy a House (₹80L)"], recommendations: ["Build emergency fund to 6 months before down payment", "Check home loan eligibility"] },
    { event: "Vacation / Travel", icon: "✈️", probability: 53, timeline: "within 3-6 months", signals: ["Travel booking activity (5 transactions)", "Vacation goal 85% funded"], recommendations: [] },
    { event: "Child Planning", icon: "👶", probability: 38, timeline: "within 12-18 months", signals: ["Increased healthcare spending", "Age and family indicators"], recommendations: [] },
  ],
  goals: [
    { id: "goal-1", name: "Buy a House (₹80L)", completion_pct: 15, eta: "2028-03-15", on_track: false, target_amount: 8000000, current_amount: 1200000 },
    { id: "goal-2", name: "Emergency Fund", completion_pct: 68.3, eta: "2027-01-15", on_track: true, target_amount: 600000, current_amount: 410000 },
    { id: "goal-3", name: "Retirement (₹5Cr)", completion_pct: 3.4, eta: "2048-12-31", on_track: true, target_amount: 50000000, current_amount: 1689200 },
    { id: "goal-4", name: "Goa Vacation", completion_pct: 85.3, eta: "2026-09-15", on_track: true, target_amount: 150000, current_amount: 128000 },
  ],
  health_timeline: [
    { month: "2025-07", score: 68.2 },
    { month: "2025-08", score: 69.1 },
    { month: "2025-09", score: 69.8 },
    { month: "2025-10", score: 70.5 },
    { month: "2025-11", score: 69.2 },
    { month: "2025-12", score: 71.8 },
    { month: "2026-01", score: 71.2 },
    { month: "2026-02", score: 70.5 },
    { month: "2026-03", score: 71.8 },
    { month: "2026-04", score: 72.9 },
    { month: "2026-05", score: 73.1 },
    { month: "2026-06", score: 72.4 },
  ],
  risk_alerts: [
    { title: "Emergency Fund Below Target", description: "Only 2.1 months of expenses covered. Target: 6 months.", severity: "high" },
    { title: "Health Insurance Gap", description: "Current cover ₹5L may be insufficient for family of 3.", severity: "high" },
    { title: "Tax Saving Opportunity", description: "₹46,000+ gap remaining in Section 80C limit.", severity: "medium" },
  ],
  recommendations: [
    { id: "idle-balance", title: "₹27,833 Idle Balance Detected", description: "Monthly surplus sitting idle in savings account.", impact: "₹20,040/year additional returns", priority: "high", category: "invest", confidence: 88 },
    { id: "tax-80c", title: "Tax Saving: ₹46,000 Under 80C", description: "Utilize remaining 80C limit with ELSS funds.", impact: "Tax saving of ~₹13,800", priority: "high", category: "save", confidence: 90 },
    { id: "insurance-health", title: "Upgrade Health Insurance", description: "Add super top-up for better coverage.", impact: "Protection against ₹10L+ medical bills", priority: "high", category: "protect", confidence: 88 },
    { id: "emergency-fund", title: "Build Emergency Fund Faster", description: "Allocate ₹15,833/month to reach 6-month target.", impact: "Financial safety net of ₹6L", priority: "medium", category: "save", confidence: 95 },
  ],
  stress_level: 22,
};

export const FALLBACK_VITALITY: any = {
  overall: 72.4,
  sub_scores: {
    income_stability: 88, savings_discipline: 71, investment_growth: 74,
    debt_health: 80, liquidity_readiness: 55, risk_resilience: 67,
    goal_achievement: 48, financial_confidence: 72,
  },
  labels: {
    income_stability: "Excellent", savings_discipline: "Strong", investment_growth: "Strong",
    debt_health: "Strong", liquidity_readiness: "Moderate", risk_resilience: "Moderate",
    goal_achievement: "Needs Attention", financial_confidence: "Strong",
  },
  explanations: {
    income_stability: "Income grew from ₹1,50,000 to ₹1,55,000 over 12 months. Consistent salary credits detected.",
    savings_discipline: "Average savings rate: 18.5% of income. Target: 30%. Room for improvement.",
    investment_growth: "Portfolio: ₹16,89,200 across 5 asset classes. Overall returns: 14.2%.",
    debt_health: "EMI-to-income ratio: 9.8%. Healthy range.",
    liquidity_readiness: "Emergency fund covers 2.1 months of expenses. Target: 6 months.",
    risk_resilience: "Life cover: ₹1,00,00,000 (5.6x income). Health cover: ₹5,00,000.",
    goal_achievement: "2 of 4 goals are over 50% complete.",
    financial_confidence: "Composite score based on overall financial health indicators.",
  },
  history: [
    { month: "2025-07", score: 68.2 }, { month: "2025-08", score: 69.1 },
    { month: "2025-09", score: 69.8 }, { month: "2025-10", score: 70.5 },
    { month: "2025-11", score: 69.2 }, { month: "2025-12", score: 71.8 },
    { month: "2026-01", score: 71.2 }, { month: "2026-02", score: 70.5 },
    { month: "2026-03", score: 71.8 }, { month: "2026-04", score: 72.9 },
    { month: "2026-05", score: 73.1 }, { month: "2026-06", score: 72.4 },
  ],
  peer_benchmark: { age_group: "30-35", median_score: 65, percentile: 78 },
  improvements: [
    { area: "goal_achievement", current_score: 48, title: "Accelerate Goal Progress", description: "Increase SIP amounts or find additional savings to allocate to priority goals.", potential_impact: 9.6 },
    { area: "liquidity_readiness", current_score: 55, title: "Build Emergency Fund", description: "Target 6 months of expenses in a liquid fund. Automate monthly transfers.", potential_impact: 7.5 },
    { area: "risk_resilience", current_score: 67, title: "Strengthen Risk Coverage", description: "Review insurance coverage. Consider increasing health cover and adding critical illness cover.", potential_impact: 3.9 },
  ],
};

export const FALLBACK_TWIN: any = {
  current_state: {
    net_worth: 1239200, total_investments: 1689200, total_debt: 320000,
    monthly_income: 153333, monthly_expenses: 95500, monthly_savings: 27833,
    monthly_investments: 30000, savings_rate: 37.7, debt_to_income: 17.4,
    investment_portfolio: [
      { type: "MF", name: "HDFC Mid-Cap Opportunities", value: 420000, return: 14 },
      { type: "MF", name: "SBI Blue Chip Fund", value: 275000, return: 12 },
      { type: "FD", name: "Bank FD", value: 214200, return: 7.1 },
      { type: "PPF", name: "Public Provident Fund", value: 332000, return: 7.1 },
      { type: "stocks", name: "Direct Equity (NIFTY 50)", value: 182000, return: 15 },
      { type: "NPS", name: "NPS Tier 1", value: 138000, return: 10 },
      { type: "gold", name: "Sovereign Gold Bonds", value: 128000, return: 8 },
    ],
  },
  projections: {
    "1yr": { net_worth: 2180000, monthly_income: 165600, monthly_expenses: 101230, total_investments: 2380000, total_debt: 140000, savings_rate: 38.9 },
    "3yr": { net_worth: 4850000, monthly_income: 193100, monthly_expenses: 113700, total_investments: 5020000, total_debt: 0, savings_rate: 41.1 },
    "5yr": { net_worth: 8920000, monthly_income: 225200, monthly_expenses: 127800, total_investments: 9100000, total_debt: 0, savings_rate: 43.2 },
    "10yr": { net_worth: 28500000, monthly_income: 330900, monthly_expenses: 170800, total_investments: 29200000, total_debt: 0, savings_rate: 48.4 },
  },
  trajectory: {
    optimistic: Array.from({ length: 41 }, (_, i) => ({ month: i * 3, year: (i * 3 / 12), net_worth: Math.round(1689200 * Math.pow(1.035, i * 3) + 35000 * i * 3) })),
    realistic: Array.from({ length: 41 }, (_, i) => ({ month: i * 3, year: (i * 3 / 12), net_worth: Math.round(1689200 * Math.pow(1.028, i * 3) + 30000 * i * 3) })),
    pessimistic: Array.from({ length: 41 }, (_, i) => ({ month: i * 3, year: (i * 3 / 12), net_worth: Math.round(1689200 * Math.pow(1.018, i * 3) + 22000 * i * 3) })),
  },
  data_sources: [
    { name: "Bank Transactions", status: "active", records: 200 },
    { name: "Salary Data", status: "active", records: 12 },
    { name: "Investment Portfolio", status: "active", records: 7 },
    { name: "Loan Records", status: "active", records: 1 },
    { name: "Insurance Data", status: "active", records: 2 },
    { name: "UPI Activity", status: "active", records: 85 },
    { name: "Monthly Financials", status: "active", records: 12 },
    { name: "Goal Preferences", status: "active", records: 4 },
  ],
  opportunities: [
    { title: "Idle Balance Optimization", description: "₹27,833/month in idle savings could earn more.", impact: "₹20,040/year potential earnings", priority: "high", category: "invest" },
    { title: "Increase Life Cover", description: "Current cover is 6x income. Recommend 10x.", impact: "Complete family financial protection", priority: "high", category: "protect" },
    { title: "Upgrade Health Insurance", description: "₹5L health cover may be insufficient.", impact: "Protection against medical inflation", priority: "high", category: "protect" },
  ],
};

export const FALLBACK_WEALTH_GPS: any = [
  {
    id: "goal-1", name: "Buy a House (₹80L)", target_amount: 8000000, current_amount: 1200000,
    remaining: 6800000, completion_pct: 15, deadline: "2028-06-30", priority: 1,
    monthly_required: 283333, monthly_contribution: 18000, gap: 265333,
    months_to_goal: 48, eta: "2030-06-15", on_track: false, probability: 42,
    optimized_probability: 67,
    waypoints: [
      { percentage: 25, amount: 2000000, status: "pending", label: "25% — ₹20,00,000" },
      { percentage: 50, amount: 4000000, status: "pending", label: "50% — ₹40,00,000" },
      { percentage: 75, amount: 6000000, status: "pending", label: "75% — ₹60,00,000" },
      { percentage: 100, amount: 8000000, status: "pending", label: "🎯 Goal — ₹80,00,000" },
    ],
    alternatives: [
      { name: "Increase Monthly Investment", description: "Add ₹2,65,333/month to reach goal on time.", monthly_amount: 283333, eta_months: 24, feasibility: "Challenging" },
      { name: "Extend Timeline", description: "Keep current investment, reach goal in 48 months.", monthly_amount: 18000, eta_months: 48, feasibility: "Easy" },
      { name: "Aggressive Growth Strategy", description: "Shift to equity-heavy portfolio (80:20).", monthly_amount: 18000, eta_months: 40, feasibility: "High Risk" },
    ],
    risks: [
      { factor: "Large Funding Gap", severity: "high", description: "Monthly gap is significant.", mitigation: "Consider additional income sources." },
      { factor: "Inflation Risk", severity: "medium", description: "Property prices may increase.", mitigation: "Review target annually." },
      { factor: "Market Volatility", severity: "medium", description: "Equity investments may underperform.", mitigation: "Maintain diversified portfolio." },
    ],
  },
  {
    id: "goal-2", name: "Emergency Fund", target_amount: 600000, current_amount: 410000,
    remaining: 190000, completion_pct: 68.3, deadline: "2027-03-31", priority: 2,
    monthly_required: 21111, monthly_contribution: 12000, gap: 9111,
    months_to_goal: 14, eta: "2027-08-15", on_track: true, probability: 78,
    optimized_probability: 92,
    waypoints: [
      { percentage: 25, amount: 150000, status: "completed", label: "25% — ₹1,50,000" },
      { percentage: 50, amount: 300000, status: "completed", label: "50% — ₹3,00,000" },
      { percentage: 75, amount: 450000, status: "upcoming", label: "75% — ₹4,50,000" },
      { percentage: 100, amount: 600000, status: "pending", label: "🎯 Goal — ₹6,00,000" },
    ],
    alternatives: [],
    risks: [{ factor: "Inflation Risk", severity: "medium", description: "Target may need revision.", mitigation: "Review every 6 months." }],
  },
  {
    id: "goal-3", name: "Retirement (₹5Cr)", target_amount: 50000000, current_amount: 1689200,
    remaining: 48310800, completion_pct: 3.4, deadline: "2048-12-31", priority: 3,
    monthly_required: 178000, monthly_contribution: 25000, gap: 153000,
    months_to_goal: 270, eta: "2048-12-31", on_track: true, probability: 72,
    optimized_probability: 88,
    waypoints: [
      { percentage: 25, amount: 12500000, status: "pending", label: "25% — ₹1.25Cr" },
      { percentage: 50, amount: 25000000, status: "pending", label: "50% — ₹2.5Cr" },
      { percentage: 75, amount: 37500000, status: "pending", label: "75% — ₹3.75Cr" },
      { percentage: 100, amount: 50000000, status: "pending", label: "🎯 Goal — ₹5Cr" },
    ],
    alternatives: [],
    risks: [],
  },
  {
    id: "goal-4", name: "Goa Vacation", target_amount: 150000, current_amount: 128000,
    remaining: 22000, completion_pct: 85.3, deadline: "2026-12-31", priority: 4,
    monthly_required: 3667, monthly_contribution: 5000, gap: 0,
    months_to_goal: 4, eta: "2026-10-15", on_track: true, probability: 95,
    optimized_probability: 95,
    waypoints: [
      { percentage: 25, amount: 37500, status: "completed", label: "25%" },
      { percentage: 50, amount: 75000, status: "completed", label: "50%" },
      { percentage: 75, amount: 112500, status: "completed", label: "75%" },
      { percentage: 100, amount: 150000, status: "upcoming", label: "🎯 Goal" },
    ],
    alternatives: [],
    risks: [],
  },
];

export const FALLBACK_STRESS: any = {
  current_level: 22,
  status: "Moderate",
  projections: { "30_day": 20.5, "90_day": 24.2, "365_day": 28.1 },
  signals: [
    { type: "moderate_emergency_fund", severity: "medium", title: "Emergency Fund Below Target", description: "2.1 months covered, target is 6 months.", weight: 10 },
    { type: "moderate_expense_ratio", severity: "medium", title: "Rising Expense Ratio", description: "Expenses are 62% of income.", weight: 10 },
  ],
  preventive_actions: [
    { title: "Build Emergency Fund", description: "Prioritize building 6 months of expenses in a liquid fund.", priority: "high", impact: "Financial safety net", category: "savings" },
    { title: "Review Monthly Expenses", description: "Identify and cut non-essential spending.", priority: "medium", impact: "Target reducing expenses by 10-15%", category: "expense" },
    { title: "Review Insurance Coverage", description: "Ensure adequate life and health insurance.", priority: "medium", impact: "Risk mitigation for family", category: "protection" },
  ],
  history: [
    { month: "2026-01", level: 20.5 }, { month: "2026-02", level: 21.2 },
    { month: "2026-03", level: 19.8 }, { month: "2026-04", level: 22.1 },
    { month: "2026-05", level: 21.5 }, { month: "2026-06", level: 22.0 },
  ],
};
