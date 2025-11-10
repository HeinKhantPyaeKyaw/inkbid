// src/hooks/seller-dashboard.api.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export async function getSellerSummary() {
  const { data } = await axios.get(`${BASE_URL}/seller-dashboard/summary`, {
    withCredentials: true,
  });
  return data as {
    in_progress: number;
    awaiting_contract: number;
    awaiting_payment: number;
    cancelled: number;
    completed: number;
    expired: number;
    total_revenue: number;
  };
}

export async function getSellerArticles(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { data } = await axios.get(`${BASE_URL}/seller-dashboard/articles`, {
    params,
    withCredentials: true,
  });
  return data;
}

export async function getSellerInventory(params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { data } = await axios.get(`${BASE_URL}/seller-dashboard/inventory`, {
    params,
    withCredentials: true,
  });
  return data;
}

export async function getSellerAnalytics(
  range: "week" | "month" | "year" = "week"
) {
  const { data } = await axios.get(`${BASE_URL}/seller-dashboard/analytics`, {
    params: { range },
    withCredentials: true,
  });
  return data as {
    range: string;
    bidsSeries: { label: string; count: number }[];
    viewsSeries: { label: string; count: number }[];
    totalBids: number;
    totalIncome: number;
  };
}

export async function sellerSignContractAPI(articleId: string) {
  const { data } = await axios.patch(
    `${BASE_URL}/contracts/${articleId}/sign`,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
}
