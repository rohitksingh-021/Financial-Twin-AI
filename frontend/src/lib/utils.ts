export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  if (amount == null || isNaN(amount)) return "₹0";
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#4f8cff";
  if (score >= 40) return "#f59e0b";
  return "#f43f5e";
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Moderate";
  if (score >= 40) return "Needs Attention";
  return "Critical";
}

export function getScoreClass(score: number): string {
  if (score >= 80) return "score-excellent";
  if (score >= 60) return "score-strong";
  if (score >= 40) return "score-moderate";
  return "score-needs-attention";
}

export function getScoreBgClass(score: number): string {
  if (score >= 80) return "score-bg-excellent";
  if (score >= 60) return "score-bg-strong";
  if (score >= 40) return "score-bg-moderate";
  return "score-bg-needs-attention";
}
