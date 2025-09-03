'use client'
import React from "react";
import { BackgroundCarousel } from "./components/background_carousel";
import { ProductCard } from "./components/product_card";
import { IContent } from "@/interfaces/content/content.domain";
import { useState, useEffect} from "react";
import { getArticles } from "@/hooks/content_detail.api";
export const LandingPage = () => {
  //-------------
  // CONST
  const [articles, setArticles] = useState<IContent[]>([])

  // QUERY
  useEffect(() => {
    async function fetchArticles() {
      try{
        const {data} = await getArticles();
        setArticles(data);
      }catch (err) {
        console.log(err);
      }
    }
    fetchArticles();
  }, [])

  return (
    <div className="flex flex-col">
      <BackgroundCarousel />
      <p className="font-Forum text-[50px] text-primary p-4">
        Recommended Articles
      </p>
      <div>
        {/* {articles.map((a) => (
          <ProductCard key={a._id} props={articles} />
        ))} */}
        <ProductCard props={articles} />
        {/* <ProductCard props={mockProduct}/> */}
      </div>
    </div>
  );
};
