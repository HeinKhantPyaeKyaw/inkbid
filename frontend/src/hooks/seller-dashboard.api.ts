// src/hooks/seller-dashboard.api.ts
import axios from "axios";

const API_BASE = "http://localhost:5500/api/v1/seller-dashboard";

export async function getSellerSummary() {
  const { data } = await axios.get(`${API_BASE}/summary`, {
    withCredentials: true,
  });
  return data as {
    in_progress: number;
    awaiting_contract: number;
    awaiting_payment: number;
    cancelled: number;
    completed: number;
    expired: number;
  };
}

export async function getSellerArticles(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { data } = await axios.get(`${API_BASE}/articles`, {
    params,
    withCredentials: true, // 🔴 sends backend auth cookie
  });
  return data;
}

export async function getSellerInventory(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { data } = await axios.get(`${API_BASE}/inventory`, {
    params,
    withCredentials: true, // 🔴 sends backend auth cookie
  });
  return data;
}
