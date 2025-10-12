"use client";
import * as React from "react";
import Pagination from "../../../buyer-dashboard/components/Pagination";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/lib/utilities/util_functions";
import { sellerSignContractAPI } from "@/hooks/seller-dashboard.api";
import ContractModalSeller from "./ContractModalSeller";
import { toast } from "react-hot-toast";

export type ArticleRow = {
  id: string;
  title: string;
  buy_now: number;
  current_bid: number;
  ends_in: string;
  status: string;
  author?: { _id: string; name: string };
  winner?: { _id: string; name: string } | null;
  buyerSigned?: boolean | "true" | "false";
  sellerSigned?: boolean | "true" | "false";
};

type Props = {
  items: ArticleRow[];
  onActionClick?: (row: ArticleRow) => void;
  onRefresh?: () => void | Promise<void>;
};

// ✅ Dynamic display logic
function getDisplayStatus(row: ArticleRow) {
  const isTrue = (v: any) => v === true || v === "true";
  const isFalse = (v: any) => v === false || v === "false";

  if (row.status === "in_progress") return "In Progress";
  if (row.status === "cancelled") return "Passed";

  // ✅ awaiting_contract logic
  if (row.status === "awaiting_contract") {
    if (isTrue(row.sellerSigned)) return "Pending"; // seller signed
    if (isFalse(row.sellerSigned) && isFalse(row.buyerSigned)) return "Won"; // no one signed yet
    return "Won";
  }

  // ✅ awaiting_payment logic
  if (row.status === "awaiting_payment") return "Pending";

  // fallback
  return "Pending";
}

const statusStyles = {
  "In Progress": "bg-blue-100/70 text-blue-700 ring-1 ring-blue-300",
  Won: "bg-green-100/70 text-green-700 ring-1 ring-green-300",
  Pending: "bg-amber-100/70 text-amber-700 ring-1 ring-amber-300",
  Passed: "bg-red-100/70 text-red-700 ring-1 ring-red-300",
} as const;

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export function ArticleTable({ items, onActionClick, onRefresh }: Props) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
  const start = currentPage * rowsPerPage;
  const end = Math.min(items.length, start + rowsPerPage);
  const pageItems = React.useMemo(
    () => items.slice(start, end),
    [items, start, end]
  );

  const [activeRowId, setActiveRowId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedArticle, setSelectedArticle] =
    React.useState<ArticleRow | null>(null);
  const [signing, setSigning] = React.useState(false);

  const handleActionClick = (row: ArticleRow) => {
    if (row.status === "awaiting_contract") {
      setSelectedArticle(row);
      setIsModalOpen(true);
    } else {
      router.push(`/content/${row.id}`);
    }
    setActiveRowId(null);
  };

  const handleAgreeContract = async () => {
    if (!selectedArticle) return;
    setSigning(true);
    try {
      await sellerSignContractAPI(selectedArticle.id);
      toast.success("Contract signed successfully");
      setIsModalOpen(false);
      await onRefresh?.();
    } catch (err) {
      console.error("Sign contract failed:", err);
      toast.error("Failed to sign contract. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  return (
    <section className="rounded-3xl border mt-4 border-black/10 bg-white/90 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <h2 className="text-xl font-semibold tracking-tight">Articles</h2>
        <p className="text-sm text-black/60">
          Track your auctions and contracts.
        </p>
      </div>

      <div className="overflow-x-auto ring-1 ring-black/5 pb-12">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[rgba(223,213,203,0.7)]">
              <Th>Title</Th>
              <Th>Buy Now</Th>
              <Th>Current Bid</Th>
              <Th>Time Remaining</Th>
              <Th>Status</Th>
              <Th className="text-right pr-4">Action</Th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {pageItems.map((row) => {
              const display = getDisplayStatus(row);
              return (
                <tr key={row.id} className="border-b border-black/5">
                  <Td>{row.title}</Td>
                  <Td className="text-center">฿ {money(row.buy_now)}</Td>
                  <Td className="text-center">฿ {money(row.current_bid)}</Td>
                  <Td className="text-center">
                    <CountdownText targetDate={row.ends_in} />
                  </Td>
                  <Td className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-semibold ${statusStyles[display]}`}
                    >
                      {display}
                    </span>
                  </Td>
                  <Td className="text-right pr-2 relative">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setActiveRowId(activeRowId === row.id ? null : row.id)
                        }
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/5 transition"
                      >
                        <DotsIcon />
                      </button>

                      {activeRowId === row.id && (
                        <div className="absolute top-10 right-0 bg-white rounded-xl shadow-lg border border-black/10 z-50">
                          <button
                            onClick={() => handleActionClick(row)}
                            className="px-4 py-2 font-semibold text-black hover:bg-black/5 whitespace-nowrap rounded-xl w-max"
                          >
                            {row.status === "awaiting_contract"
                              ? "Sign Contract"
                              : "View Details"}
                          </button>
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ContractModalSeller
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={
          selectedArticle
            ? {
                _id: selectedArticle.id,
                title: selectedArticle.title,
                highest_bid:
                  selectedArticle.current_bid ?? selectedArticle.buy_now ?? 0,
                author: selectedArticle.author || { _id: "", name: "Seller" },
                winner: selectedArticle.winner || null,
              }
            : null
        }
        onAgree={handleAgreeContract}
        signing={signing}
      />

      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-[#313131]">
          Showing {start + 1}–{end} of {items.length}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onClickPreviousPage={() => setCurrentPage((p) => Math.max(0, p - 1))}
          onClickNextPage={() =>
            setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
          }
        />
      </div>
    </section>
  );
}

function Th({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th
      className={`text-center text-[30px] font-normal font-Forum py-3 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <td
      className={`py-4 pl-4 pr-3 text-[#313131] font-Montserrat text-[20px] ${className}`}
    >
      {children}
    </td>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function CountdownText({ targetDate }: { targetDate: string }) {
  const left = useCountdown(targetDate);
  return <span>{left}</span>;
}
