// components/ArticlesTable.tsx
"use client";
import * as React from "react";
import Pagination from "../../../buyer-dashboard/components/Pagination";
import {
  faFileLines,
  faFileSignature,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type InventoryRow = {
  id: string;
  title: string;
  purchased_date: number;
  contract_period: string; // already formatted, e.g. "01 Days 02 Hours 12 Mins"
  status: string;
};

type Props = {
  items: InventoryRow[];
  onActionClick?: (row: InventoryRow) => void;
};

// backend -> ui mapping
const statusMap: Record<string, "Active" | "Expired" > = {
  completed: "Active",
  expired: "Expired",
};

// Tailwind styles for each display status
const statusStyles: Record<"Active" | "Expired", string> = {
  Active: "bg-green-100/70 text-green-700 ring-1 ring-green-200",
  Expired: "bg-red-100/70 text-red-700 ring-1 ring-red-200",
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

// Format timestamp to MM/DD/YYYY
const formatDate = (timestamp: number): string => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // 0-indexed
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export function InventoryTable({ items, onActionClick }: Props) {
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

  // clamp page if data length changes (prevents “blank” pages after filters/refresh)
  React.useEffect(() => {
    if (currentPage > totalPages - 1) setCurrentPage(totalPages - 1);
  }, [totalPages, currentPage, items.length]);

  return (
    <section className="rounded-3xl border mt-4 border-black/10 bg-white/90 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-4 pb-3">
        <h2 className="text-xl font-semibold tracking-tight">Inventory</h2>
        <p className="text-sm text-black/60">
          Keep track of purchased articles and other information.
        </p>
      </div>

      {/* Table */}
      <div className="pb-4">
        <div className="overflow-x-auto ring-1 ring-black/5">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[rgba(223,213,203,0.7)]">
                <Th className="">Title</Th>
                <Th>Purchased Date</Th>
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

                  <Td >{formatDate(row.purchased_date)}</Td>


                  <Td>
                    {(() => {
                      const display =
                        statusMap[row.status as keyof typeof statusMap] ||
                        "Expired";
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

                  <Td className="text-right pr-2">
                    {row.status === "completed" ? (
                      <div className="flex space-x-8 items-center justify-end">
                        <button
                          type="button"
                          className="flex-col inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/5 transition pointer-events-auto cursor-pointer hover:scale-120"
                          aria-label={`Actions for ${row.title}`}
                          onClick={() =>
                            window.open(
                              `${process.env.NEXT_PUBLIC_API_BASE}/seller-dashboard/download/contract/${row.id}`,
                              "_blank"
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faFileSignature}
                            className="text-[#313131] text-3xl"
                          />
                          <p className="tracking-tighter text-[16px]">
                            Contract
                          </p>
                        </button>
                        <button
                          type="button"
                          className="flex-col inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/5 transition pointer-events-auto cursor-pointer hover:scale-120"
                          aria-label={`Actions for ${row.title}`}
                          onClick={() =>
                            window.open(
                              `${process.env.NEXT_PUBLIC_API_BASE}/seller-dashboard/download/article/${row.id}`,
                              "_blank"
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faFileLines}
                            className="text-[#313131] text-3xl"
                          />
                          <p className="tracking-tighter text-[16px]">
                            Article
                          </p>
                        </button>
                      </div>
                    ) : (
                      <div />
                    )}
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
        "text-left text-[30px] font-normal tracking-wide text-black font-Forum",
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
      className={["py-4 pl-4 pr-3 text-[#313131] font-Montserrat align-middle text-[20px]", className].join(
        " "
      )}
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
