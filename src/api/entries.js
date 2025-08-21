// src/api/entries.js
import { api } from "../lib/api";

export const listEntries = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return api(`/api/v1/entries${qs ? `?${qs}` : ""}`);
};

export const getEntry = (id) => api(`/api/v1/entries/${id}`);

export const createEntry = (payload) =>
  api(`/api/v1/entries`, { method: "POST", body: JSON.stringify(payload) });

export const weeklySummary = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return api(`/api/v1/summary/weekly${qs ? `?${qs}` : ""}`);
};

export const monthlySummary = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return api(`/api/v1/summary/monthly${qs ? `?${qs}` : ""}`);
};

export const dailyPrompts = () => api(`/api/v1/prompts/daily`);

export const suggestions = (q = {}) => {
  const qs = new URLSearchParams(q).toString();
  return api(`/api/v1/suggestions${qs ? `?${qs}` : ""}`);
};
