// src/lib/api.js (FRONTEND)
import { getAuth } from "firebase/auth";

const BASE = import.meta.env?.VITE_API_URL ?? "http://localhost:5000";

export async function api(path, opts = {}) {
  const user = getAuth().currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error || body?.message || message;
      const err = new Error(message);
      err.status = res.status;
      err.body = body;
      throw err;
    } catch (e) {
      if (!e.status) {
        const err = new Error(message);
        err.status = res.status;
        throw err;
      }
      throw e;
    }
  }
  return res.status === 204 ? null : res.json();
}
