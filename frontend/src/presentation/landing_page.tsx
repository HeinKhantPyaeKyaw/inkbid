"use client";
import React, { useState, useEffect, Suspense } from "react";
import { BackgroundCarousel } from "./components/background_carousel";
import ProductCard from "./components/product_card";
import axios from "axios";
import { useSearchParams } from "next/navigation";

function LandingContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  // 🔍 Read URL parameters
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "";
  const dir = searchParams.get("dir") || "desc";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "12";

  // 🔁 Fetch articles whenever filters change
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/articles`, {
          params: { q, genre, rating, sort, dir, page, limit },
          withCredentials: true,
        });
        setArticles(data.items || []);
      } catch (err) {
        console.error("Error fetching marketplace data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [q, genre, rating, sort, dir, page, limit]);

  return (
    <div className="flex flex-col">
      <BackgroundCarousel />
      <p className="font-Forum text-[50px] text-primary p-4">
        Recommended Articles
      </p>
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading articles...</p>
      ) : (
        <ProductCard articles={articles} />
      )}
    </div>
  );
}

// ✅ Wrap LandingContent in Suspense boundary
export const LandingPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading landing page...
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  );
};
