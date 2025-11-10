import { useEffect, useState } from "react";
import { EngagementChart } from "./engagement_chart";
import { getSellerAnalytics } from "@/hooks/seller-dashboard.api";

export const EngagementSection = () => {
  const [range, setRange] = useState<"week" | "month" | "year">("week");
  const [analytics, setAnalytics] = useState<{
    bidsSeries: { label: string; count: number }[];
    viewsSeries: { label: string; count: number }[];
    totalBids: number;
    totalIncome: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSellerAnalytics(range);
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    })();
  }, [range]);

  return (
    <div className="flex flex-col">
      <div className="flex bg-tertiary p-4 shadow-lg rounded-lg space-x-4 mt-4 items-center justify-between">
        <div className="flex flex-col w-[500px] ml-12">
          <div className="w-[500px]">
            <p className="font-Forum text-center font-bold text-shadow-xl text-[30px] text-[#313131]">
              Engagement Analysis
            </p>
            <EngagementChart
              bidsSeries={analytics?.bidsSeries ?? []}
              viewsSeries={analytics?.viewsSeries ?? []}
            />
          </div>
          <div className="flex ml-10 space-x-4">
            <Legend color="#E0C58F" label="Bids" />
            <Legend color="#3C507D" label="Views" />
            {(["week", "month", "year"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-2 font-Montserrat font-bold text-[15px] ${
                  range === r
                    ? "bg-[#3C507D] text-white"
                    : "bg-white text-[#313131]"
                }`}
              >
                {r === "week" ? "Weeks" : r === "month" ? "Months" : "Years"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-[200px] justify-center">
          <div
            className="border-4 border-white flex text-[#313131] text-center items-center justify-center font-Montserrat rounded-lg font-bold text-[50px] w-[200px] h-[200px]"
            style={{ textShadow: "2px 12px 2px rgba(0, 0, 0, 0.25)" }}
          >
            {analytics ? analytics.totalBids : "-"}
          </div>
          <div className="font-Forum font-bold text-[#313131] text-[30px]">
            Total <br /> Bids Placed
          </div>
        </div>

        <div className="flex flex-col w-[400px] justify-center mr-20">
          <div
            className="border-4 border-white flex text-center text-[#313131] items-center justify-center font-Montserrat rounded-lg font-bold text-[50px] w-[400px] h-[200px]"
            style={{ textShadow: "2px 12px 2px rgba(0, 0, 0, 0.25)" }}
          >
            ฿{analytics ? analytics.totalIncome.toLocaleString("en-US") : "-"}
          </div>
          <div className="font-Forum font-bold text-[30px] text-[#313131] text-left">
            Total <br />
            Income Generated
          </div>
        </div>
      </div>
    </div>
  );
};

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex space-x-1 justify-center items-center">
      <div className="w-[20px] h-[20px]" style={{ backgroundColor: color }} />
      <p className="font-Montserrat font-medium">{label}</p>
    </div>
  );
}
