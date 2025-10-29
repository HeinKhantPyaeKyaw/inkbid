"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import NavbarSecondary from "../components/navbar/narbar_secondary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

function CountdownTimer({ endsIn }: { endsIn: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endsIn).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endsIn]);

  return <span className="text-primary font-medium">Ends In: {timeLeft}</span>;
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching articles data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [q, genre, rating, sort, dir, page, limit]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 🔝 Navbar with search + filters */}
      <NavbarSecondary />

      <div className="px-8 py-8">
        <h1 className="text-4xl font-Forum text-primary mb-8 text-center">
          Explore Articles
        </h1>

        {/* 🕓 Loading / Empty / Data states */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">
            Loading articles...
          </p>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No articles found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition"
              >
                <img
                  src={article.img_url || "/placeholder.jpg"}
                  alt={article.title || "Article Image"}
                  className="w-full h-56 object-cover rounded-xl mb-4"
                />
                <h2 className="text-xl font-semibold text-primary mb-1">
                  {article.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {article.synopsis || "No description available."}
                </p>

                <div className="flex justify-between items-center text-gray-700 mb-2">
                  <span className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faUser} className="text-accent" />
                    {article.author?.name || "Unknown"}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faClock} />
                    {article.ends_in
                      ? new Date(article.ends_in).toLocaleDateString()
                      : "No end date"}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <p>
                    Bid: ฿
                    {Number(
                      article.highest_bid?.$numberDecimal ||
                        article.highest_bid ||
                        0
                    )}
                  </p>
                  <p>
                    Buy Now: ฿
                    {Number(
                      article.buy_now?.$numberDecimal || article.buy_now || 0
                    )}
                  </p>
                </div>

                {/* 🏷 Genres and Writing Styles */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.isArray(article.tag?.genre) &&
                    article.tag.genre.map((g: any, i: number) => (
                      <span
                        key={g._id || i}
                        className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-300"
                      >
                        {g.keyword}
                      </span>
                    ))}

                  {Array.isArray(article.tag?.writing_style) &&
                    article.tag.writing_style.map((w: any, i: number) => (
                      <span
                        key={w._id || i}
                        className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200"
                      >
                        {w.keyword}
                      </span>
                    ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/content/${article._id}`}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
                  >
                    View Details
                  </Link>
                  <div className="text-sm text-gray-500">
                    <CountdownTimer endsIn={article.ends_in} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading articles...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
