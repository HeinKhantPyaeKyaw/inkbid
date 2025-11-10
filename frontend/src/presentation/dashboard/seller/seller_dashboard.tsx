'use client';
import { useAuth } from '@/context/auth/AuthContext';
import {
  getSellerArticles,
  getSellerInventory,
  getSellerSummary,
} from '@/hooks/seller-dashboard.api';
import { NavbarPrimary } from '@/presentation/components/navbar/navbar_primary';
import {
  faBoxArchive,
  faEllipsis,
  faGavel,
  faHammer,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { ArticleTable, type ArticleRow } from './components/article_table';
import { EngagementSection } from './components/engagement_section';
import { InventoryRow, InventoryTable } from './components/inventory.table';
import { StatCard } from './components/stat_card';
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";


interface SellerSummary {
  in_progress: number;
  awaiting_contract: number;
  awaiting_payment: number;
  cancelled: number;
  completed: number;
  expired: number;
  total_revenue: number;
}

interface SellerArticleApi {
  _id: string;
  title: string;
  buy_now: number;
  current_bid: number;
  ends_in: string;
  status: string;
  author: { _id: string; name: string; email: string };
  winner?: { _id: string; name: string; email: string } | null;
  buyerSigned?: boolean;
  sellerSigned?: boolean;
}

interface SellerInventoryApi {
  _id: string;
  title: string;
  purchased_date: number;
  contract_period: string;
  status: string;
}

export const SellerDashboard = () => {
  const { user } = useAuth();

  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [summary, setSummary] = useState<SellerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE!, {
    withCredentials: true,
  });

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [articleRes, inventoryRes, summaryRes] = await Promise.all([
        getSellerArticles({ page: 1, limit: 20 }),
        getSellerInventory({ page: 1, limit: 20 }),
        getSellerSummary(),
      ]);

      setArticles(
        ((articleRes.items as SellerArticleApi[]) ?? []).map((item) => ({
          id: item._id,
          title: item.title,
          buy_now: item.buy_now,
          current_bid: item.current_bid,
          ends_in: item.ends_in,
          status: item.status,
          author: item.author
            ? { _id: item.author._id, name: item.author.name }
            : { _id: "", name: "Unknown Seller" },
          winner: item.winner
            ? { _id: item.winner._id, name: item.winner.name }
            : null,
          buyerSigned: item.buyerSigned ?? false,
          sellerSigned: item.sellerSigned ?? false,
        }))
      );

      setInventory(
        ((inventoryRes.items as SellerInventoryApi[]) ?? []).map((item) => ({
          id: item._id,
          title: item.title,
          purchased_date: item.purchased_date,
          contract_period: item.contract_period,
          status: item.status,
        }))
      );

      setSummary(summaryRes);
    } catch (err) {
      console.error("Seller dashboard load failed:", err);
      setError("Failed to load data (check login or network)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    socket.on("bidUpdate", (update) => {

      setArticles((prev) =>
        prev.map((article) =>
          article.id === update.articleId
            ? { ...article, current_bid: update.amount }
            : article
        )
      );

      toast(`💰 New bid placed on ${update.title || "an article"}`);
    });

    socket.on("statusUpdate", (update) => {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === update.articleId ? { ...a, status: update.status } : a
        )
      );
    });

    return () => {
      socket.off("bidUpdate");
      socket.off("statusUpdate");
    };
  }, [socket]);

  return (
    <>
      <NavbarPrimary user={user?.role} userId={user?.id} />
      <div className="flex flex-col mx-16">
        <p className="font-Forum text-[40px]"> Dashboard </p>
        <p className="font-Montserrat text-[15px]">
          An overview of all biddings, inventory, and analysis.
        </p>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <StatCard
            title={"Total Revenue Generated"}
            value={summary?.total_revenue || "-"}
            icon={faTriangleExclamation}
          />
          <StatCard
            title={"Total Article Bids In-Progress"}
            value={summary?.in_progress || "-"}
            icon={faGavel}
          />
          <StatCard
            title={"Total Articles Sold"}
            value={summary?.completed || "-"}
            icon={faBoxArchive}
          />
          <StatCard
            title={"Total Bids Awaiting Action"}
            value={summary?.awaiting_contract || "-"}
            icon={faEllipsis}
          />
        </div>
        <ArticleTable
          items={articles}
          onActionClick={(row) => console.log("Action for:", row)}
          onRefresh={fetchAll}
        />
        <div className="h-[2px] w-[80%] bg-black my-[16px] self-center" />
        <InventoryTable
          items={inventory}
          onActionClick={(row) => console.log("Action for:", row)}
        />
      </div>
    </>
  );
};
