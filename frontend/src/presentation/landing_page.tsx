import React from "react";
import { BackgroundCarousel } from "./components/background_carousel";
import { ProductCard } from "./components/product_card";
import { IContent } from "@/interfaces/content/content.domain";

export const LandingPage = () => {

const mockProduct: IContent[] = [
  {
    title: "Oval office or hall of shame",
    date: "16/August/2025",
    author: "Bill Murry",
    rating: 3,
    genre: "Politics",
    writing_style: "Academic",
    tag: "Political Commentary",
    due: "19/August/2025",
    description:
      "This article explores how escalating global tariff wars are intensifying the economic divide between high-income and low-income household of the citizens of United States of America",
    highest_bid: 100,
    buy_now: 500,
  },
  {
    title: "Tech Revolution Impact",
    date: "17/August/2025",
    author: "Jane Smith",
    rating: 2.5,
    genre: "Technology",
    writing_style: "Journalistic",
    tag: "Innovation",
    due: "22/August/2025",
    description:
      "An in-depth analysis of how emerging technologies are reshaping industries and creating new opportunities for economic growth",
    highest_bid: 150,
    buy_now: 600,
  },
  {
    title: "Climate Change Economics",
    date: "18/August/2025",
    author: "Dr. Green",
    rating: 5,
    genre: "Economics",
    writing_style: "Academic",
    tag: "Environmental Policy",
    due: "25/August/2025",
    description:
      "Examining the economic implications of climate change policies and their impact on global markets and sustainability initiatives",
    highest_bid: 200,
    buy_now: 750,
  },
  {
    title: "Climate Change Economics",
    date: "18/August/2025",
    author: "Dr. Green",
    rating: 5,
    genre: "Economics",
    writing_style: "Academic",
    tag: "Environmental Policy",
    due: "25/August/2025",
    description:
      "Examining the economic implications of climate change policies and their impact on global markets and sustainability initiatives",
    highest_bid: 200,
    buy_now: 750,
  },
  {
    title: "Climate Change Economics",
    date: "18/August/2025",
    author: "Dr. Green",
    rating: 5,
    genre: "Economics",
    writing_style: "Academic",
    tag: "Environmental Policy",
    due: "25/August/2025",
    description:
      "Examining the economic implications of climate change policies and their impact on global markets and sustainability initiatives",
    highest_bid: 200,
    buy_now: 750,
  },
];

  return (
    <div className="flex flex-col">
      <BackgroundCarousel />
      <p className="font-Forum text-[50px] text-primary p-4">
        Recommended Articles
      </p>
      <div>
        <ProductCard props={mockProduct}/>
      </div>
    </div>
  );
};
