// components/ArticlesTable.tsx
"use client";
import * as React from "react";

type Status = "In Progress" | "Sold" | "Passed" | "Pending";

export type ArticleRow = {
  id: string;
  title: string;
  buyNow: number;
  currentBid: number;
  timeRemaining: string; // already formatted, e.g. "01 Days 02 Hours 12 Mins"
  status: Status;
};

type Props = {
  items: ArticleRow[];
  onActionClick?: (row: ArticleRow) => void;
};

const statusStyles: Record<Status, string> = {
  "In Progress": "bg-blue-100/70 text-blue-700 ring-1 ring-blue-200",
  Sold: "bg-green-100/70 text-green-700 ring-1 ring-green-200",
  Passed: "bg-red-100/70 text-red-700 ring-1 ring-red-200",
  Pending: "bg-amber-100/70 text-amber-700 ring-1 ring-amber-200",
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export function ArticleTable({ items, onActionClick }: Props) {
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
        <div className="overflow-x-auto ring-1 ring-black/5">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[rgba(223,213,203,0.7)]">
                <Th className="">Title</Th>
                <Th>Buy Now</Th>
                <Th>Current Bid</Th>
                <Th>Time Remaining</Th>
                <Th>Status</Th>
                <Th className="text-right pr-4">Action</Th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {items.map((row, i) => (
                <tr
                  key={row.id}
                  className={
                    i !== items.length - 1 ? "border-b border-black/5" : ""
                  }
                >
                  <Td>
                    <div className="max-w-[36rem] truncate">{row.title}</div>
                  </Td>

                  <Td className="tabular-nums">
                    <span className="mr-2">฿</span>
                    {money(row.buyNow)}
                  </Td>

                  <Td className="tabular-nums">
                    <span className="mr-2">฿</span>
                    {money(row.currentBid)}
                  </Td>

                  <Td className="whitespace-nowrap">{row.timeRemaining}</Td>

                  <Td>
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                        statusStyles[row.status],
                      ].join(" ")}
                    >
                      {row.status}
                    </span>
                  </Td>

                  <Td className="text-right pr-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/5 transition pointer-events-auto"
                      aria-label={`Actions for ${row.title}`}
                      onClick={() => onActionClick?.(row)}
                    >
                      <DotsIcon />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        "text-left text-lg font-semibold tracking-wide text-black/80",
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
      className={["py-4 pl-4 pr-3 text-black/85 align-middle", className].join(
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
