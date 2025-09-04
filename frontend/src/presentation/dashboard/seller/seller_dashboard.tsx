'use client'
import { faBoxArchive, faEllipsis, faGavel, faHammer, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { EngagementSection } from "./components/engagement_section";
import { StatCard } from "./components/stat_card";
import { ArticleTable, type ArticleRow } from "./components/article_table";

export const SellerDashboard = () => {
  const StatData = [
    {
      key: "In-Progress",
      value: 4,
    },
    {
      key: "Sold",
      value: 14,
    },
    {
      key: "Action",
      value: 2,
    },
    {
      key: "Contracts",
      value: 1,
    },
  ];

  const rows: ArticleRow[] = [
    {
      id: "1",
      title:
        "The equilibrium of high income vs low income disparity heightens amidst…",
      buyNow: 5000,
      currentBid: 15000,
      timeRemaining: "01 Days 02 Hours 12 Mins",
      status: "In Progress",
    },
    {
      id: "2",
      title: "From Gig to Grind: The Hidden Costs of the Freelance Economy",
      buyNow: 15000,
      currentBid: 1500,
      timeRemaining: "0 Days 00 Hours 00 Mins",
      status: "Sold",
    },
    {
      id: "3",
      title: "Algorithmic Inequality: How AI is Reshaping the Job Market…",
      buyNow: 2000,
      currentBid: 0,
      timeRemaining: "00 Days 00 Hours 00 Mins",
      status: "Passed",
    },
    {
      id: "4",
      title:
        "Digital Borders: How Data Privacy Laws Are Redrawing the Map of the Internet…",
      buyNow: 2500,
      currentBid: 4000,
      timeRemaining: "00 Days 00 Hours 00 Mins",
      status: "Pending",
    },
  ];
  return (
    <div className="flex flex-col mx-16">
      <p className="font-Forum text-[40px]"> Dashboard </p>
      <p className="font-Montserrat text-[15px]">
        An overview of all biddings, inventory, and analysis.
      </p>
      <EngagementSection />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <StatCard
          title={"Total Article Bids In-Progress"}
          value={
            StatData.find((item) => item.key === "In-Progress")?.value || 0
          }
          icon={faGavel}
        />
        <StatCard
          title={"Total Articles Sold"}
          value={StatData.find((item) => item.key === "Sold")?.value || 0}
          icon={faBoxArchive}
        />
        <StatCard
          title={"Total Bids Awaiting Action"}
          value={StatData.find((item) => item.key === "Action")?.value || 0}
          icon={faEllipsis}
        />
        <StatCard
          title={"Total Expired Contracts"}
          value={StatData.find((item) => item.key === "Contracts")?.value || 0}
          icon={faTriangleExclamation}
        />
      </div>
      <ArticleTable
        items={rows}
        onActionClick={(row) => console.log("Action for:", row)}
      />
    </div>
  );
};
