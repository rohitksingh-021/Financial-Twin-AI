import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchDashboard() {
  const { data } = await api.get("/dashboard");
  return data;
}

export async function fetchVitality() {
  const { data } = await api.get("/vitality");
  return data;
}

export async function fetchTwin() {
  const { data } = await api.get("/twin");
  return data;
}

export async function fetchWealthGPS() {
  const { data } = await api.get("/wealth-gps");
  return data;
}

export async function runSimulation(scenario: string, params: Record<string, number>) {
  const { data } = await api.post("/simulator", { scenario, params });
  return data;
}

export async function fetchScenarios() {
  const { data } = await api.get("/simulator/scenarios");
  return data;
}

export async function fetchRecommendations() {
  const { data } = await api.get("/advisor/recommendations");
  return data;
}

export async function sendChatMessage(message: string) {
  const { data } = await api.post("/advisor/chat", { message });
  return data;
}

export async function fetchStress() {
  const { data } = await api.get("/stress");
  return data;
}

export async function fetchLifeEvents() {
  const { data } = await api.get("/life-events");
  return data;
}

export async function fetchCustomer() {
  const { data } = await api.get("/customer");
  return data;
}

export async function setCustomer(customerData: unknown) {
  const { data } = await api.post("/customer", customerData);
  return data;
}

export async function resetCustomer() {
  const { data } = await api.post("/customer/reset");
  return data;
}

export default api;
