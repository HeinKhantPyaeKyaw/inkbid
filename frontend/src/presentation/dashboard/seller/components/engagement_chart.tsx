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


export const EngagementChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Series A",
        data: [0, 35, 25, 50, 110], // gold line
        borderColor: "#E0C58F",
        backgroundColor: "#E0C58F",
        fill: false,
        pointRadius: 0,
      },
      {
        label: "Series B",
        data: [0, 50, 10, 35, 90], // dark blue line
        borderColor: "#3C507D",
        backgroundColor: "#3C507D",
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // hide legend like your mockup
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 25,
          color: "#fff",
          font: {
            size: 14,
            family: "montserrat",
            weight: "bold" as const,
          },
          padding: 8,
        },
        grid: {
          color: "#fff",
          drawTicks: false,
        },
      },
      x: {
        ticks: {
          color: "#fff",
          font: {
            size: 14,
            family: "montserrat",
            weight: "bold" as const,
          },
          padding: 8,
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
    },
  };

  // Shadow plugin
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
    <div className=" p-6 rounded-xl">
      <Line data={data} options={options} plugins={[lineShadowPlugin]} />
    </div>
  );
};
