// components/ArticlesTable.tsx
"use client";
import * as React from "react";
import Pagination from "../../../buyer-dashboard/components/Pagination";
import { useCountdown } from "@/lib/utilities/util_functions";
import { useRouter } from "next/navigation";


export type ArticleRow = {
  id: string;
  title: string;
  buy_now: number;
  current_bid: number;
  ends_in: string; // already formatted, e.g. "01 Days 02 Hours 12 Mins"
  status: string;
};

type Props = {
  items: ArticleRow[];
  onActionClick?: (row: ArticleRow) => void;
};

// backend -> ui mapping
const statusMap: Record<string, "In Progress" | "Won" | "Pending" | "Passed"> = {
  in_progress: "In Progress",
  awaiting_contract: "Won",
  awaiting_payment: "Pending",
  cancelled: "Passed",
};

// Tailwind styles for each display status
const statusStyles: Record<"In Progress" | "Won" | "Pending" | "Passed", string> = {
  "In Progress": "bg-blue-100/70 text-blue-700 ring-1 ring-blue-300",
  Won: "bg-green-100/70 text-green-700 ring-1 ring-green-300",
  Pending: "bg-amber-100/70 text-amber-700 ring-1 ring-amber-300",
  Passed: "bg-red-100/70 text-red-700 ring-1 ring-red-300",
};


const money = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export function ArticleTable({ items, onActionClick }: Props) {
  // If your table receives `items` (or `rows`/`articles`) — use that array name below.
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10; // keep your layout balanced; tweak to your preference

  // If your data array is named something else, replace `items` accordingly:
  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
  const start = currentPage * rowsPerPage;
  const end = Math.min(items.length, start + rowsPerPage);
  const pageItems = React.useMemo(
    () => items.slice(start, end),
    [items, start, end]
  );
  const router = useRouter();
  const [activeRowId, setActiveRowId] = React.useState<string | null>(null);

  // clamp page if data length changes (prevents “blank” pages after filters/refresh)
  React.useEffect(() => {
    if (currentPage > totalPages - 1) setCurrentPage(totalPages - 1);
  }, [totalPages, currentPage, items.length]);

  // close popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu")) setActiveRowId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  const handleAction = (row: ArticleRow) => {
    const status = row.status;
    switch (status) {
      case "in_progress":
        router.push(`/buyer/articles/${row.id}`);
        break;
      case "awaiting_contract":
        router.push(`/buyer/contracts/${row.id}`);
        break;
      case "awaiting_payment":
        router.push(`/buyer/payment/${row.id}`);
        break;
      case "cancelled":
        router.push(`/buyer/history/${row.id}`);
        break;
      default:
        router.push(`/buyer/articles/${row.id}`);
    }
  };

   React.useEffect(() => {
     console.log("✅ React re-rendered with activeRowId =", activeRowId);
   }, [activeRowId]);

  return (
    <section className="rounded-3xl border mt-4 border-black/10 bg-white/90 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-4 pb-3">
        <h2 className="text-xl font-semibold tracking-tight">Articles</h2>
        <p className="text-sm text-black/60">
          Keep track of recent biddings and other information.
        </p>
      </div>

      {/* Table */}
      <div className="pb-4">
        <div className="overflow-x-auto ring-1 ring-black/5 pb-12">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[rgba(223,213,203,0.7)]">
                <Th className="text-left">Title</Th>
                <Th>Buy Now</Th>
                <Th>Current Bid</Th>
                <Th>Time Remaining</Th>
                <Th>Status</Th>
                <Th className="text-right pr-4">Action</Th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageItems.map((row, i) => (
                <tr
                  key={row.id || i}
                  className={
                    i !== items.length - 1 ? "border-b border-black/5" : ""
                  }
                >
                  <Td>
                    <div className="max-w-[36rem] truncate">{row.title}</div>
                  </Td>

                  <Td className="tabular-nums text-center">
                    <span className="mr-2">฿</span>
                    {money(row.buy_now)}
                  </Td>

                  <Td className="tabular-nums text-center">
                    <span className="mr-2">฿</span>
                    {money(row.current_bid)}
                  </Td>

                  <Td className="whitespace-nowrap text-center">
                    <CountdownText targetDate={row.ends_in} />
                  </Td>

                  <Td className="text-center">
                    {(() => {
                      const display =
                        statusMap[row.status as keyof typeof statusMap] ||
                        "Pending";
                      return (
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-3 py-1 font-semibold",
                            statusStyles[display],
                          ].join(" ")}
                        >
                          {display}
                        </span>
                      );
                    })()}
                  </Td>

                  <Td className="text-right pr-2 relative">
                    <div className="action-menu relative inline-block">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/5 transition pointer-events-auto"
                        aria-label={`Actions for ${row.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRowId(
                            activeRowId === row.id ? null : row.id
                          );
                          console.log("Clicked action for row:", row);
                        }}
                      >
                        <DotsIcon />
                      </button>

                      {activeRowId === row.id && (
                        <div className="absolute top-10 right-0 bg-white rounded-xl shadow-lg border border-black/10 z-50 animate-fade-in">
                          <button
                            onClick={() => handleAction(row)}
                            className="px-4 py-2 font-semibold text-black hover:bg-black/5 w-max whitespace-nowrap rounded-xl"
                          >
                            {row.status === "awaiting_contract"
                              ? "Sign Contract"
                              : row.status === "awaiting_payment"
                              ? "Make Payment"
                              : row.status === "in_progress"
                              ? "View Details"
                              : "View Summary"}
                          </button>
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-[#313131]">
          Showing {items.length === 0 ? 0 : start + 1}–{end} of {items.length}
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

/* ---------- small helpers ---------- */
function Th({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th
      scope="col"
      className={[
        "text-center text-[30px] font-normal tracking-wide text-black font-Forum",
        "py-3 pl-4 pr-3",
        className,
      ].join(" ")}
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
      className={[
        "py-4 pl-4 pr-3 text-[#313131] font-Montserrat align-middle text-[20px]",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}

function DotsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
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