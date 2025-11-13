/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  bidsSeries: { label: string; count: number }[];
  viewsSeries: { label: string; count: number }[];
};

export const EngagementChart: React.FC<Props> = ({
  bidsSeries,
  viewsSeries,
}) => {
  const labels =
    bidsSeries.length > 0
      ? bidsSeries.map((p) => p.label)
      : viewsSeries.map((p) => p.label);

  const data = {
    labels,
    datasets: [
      {
        label: "Bids",
        data: bidsSeries.map((p) => p.count),
        borderColor: "#E0C58F",
        backgroundColor: "#E0C58F",
        fill: false,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: "Views",
        data: viewsSeries.map((p) => p.count),
        borderColor: "#3C507D",
        backgroundColor: "#3C507D",
        fill: false,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
          font: { size: 14, family: "montserrat", weight: "bold" as const },
          padding: 8,
        },
        grid: { color: "#fff", drawTicks: false },
      },
      x: {
        ticks: {
          color: "#fff",
          font: { size: 14, family: "montserrat", weight: "bold" as const },
          padding: 8,
        },
        grid: { display: false, drawTicks: false },
      },
    },
  };

  const lineShadowPlugin = {
    id: "lineShadow",
    beforeDatasetsDraw(chart: any) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden && meta.type === "line") {
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          ctx.shadowBlur = 1;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 15;
          ctx.strokeStyle = dataset.borderColor;
          ctx.lineWidth = dataset.borderWidth || 2;
          ctx.beginPath();
          meta.dataset.draw(ctx);
          ctx.restore();
        }
      });
    },
  };

  return (
    <div className="p-6 rounded-xl">
      <Line data={data} options={options} plugins={[lineShadowPlugin]} />
    </div>
  );
};
