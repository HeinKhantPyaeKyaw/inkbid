"use client";

import { IContent } from "@/interfaces/content/content.domain";
import { Rating } from "@mui/material";
import Link from "next/link";
import { calculateCountdown } from "@/lib/utilities/util_functions";

interface ProductCardProps {
  articles?: IContent[];
}

export default function ProductCard({ articles }: ProductCardProps) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg mt-8">
        No articles found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 justify-items-center">
      {articles.map((product, index) => {
        const countdown = calculateCountdown(product.ends_in);

        return (
          <Link href={`/content/${product._id}`} key={product._id || index}>
            <div className="flex flex-col w-[350px] h-[350px] overflow-hidden bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex font-Forum">
                <img
                  src={product.img_url || "/placeholder.jpg"}
                  alt={product.title || "Product Image"}
                  className="w-[150px] h-[150px] object-cover rounded-lg m-2 shadow-lg border"
                />

                <div className="flex flex-col w-full mt-1 pr-2">
                  <p className="text-[20px] leading-tight truncate">
                    {product.title}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {new Date(product.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-[15px] font-semibold text-primary">
                      {product.author?.name || "Unknown"}
                    </p>
                    <Rating
                      name={`rating-${index}`}
                      value={product?.author?.rating || 0}
                      precision={0.5}
                      size="small"
                      readOnly
                      className="pr-2"
                    />
                  </div>

                  <div className="w-full h-[1px] bg-gray-300 my-1" />

                  <div className="flex flex-wrap gap-2 mt-1 text-black">
                    {product?.tag?.genre?.map((g, i) => (
                      <p
                        key={`${g.code}-${i}`}
                        className="px-2 bg-gray-200 rounded-full border text-[12px] h-[25px] flex items-center"
                      >
                        {g.keyword}
                      </p>
                    ))}
                    {product?.tag?.writing_style?.map((w, i) => (
                      <p
                        key={`${w.code}-${i}`}
                        className="px-2 bg-gray-200 rounded-full border text-[12px] h-[25px] flex items-center"
                      >
                        {w.keyword}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <p className="font-Montserrat text-[15px] px-4 line-clamp-3 text-gray-700">
                {product.synopsis}
              </p>

              <div className="flex justify-between items-center space-x-2 px-4 mt-2">
                <div className="flex space-x-2 bg-secondary border-2 border-primary rounded-lg p-1 w-full">
                  <p className="font-Forum leading-tight w-full text-[20px] text-primary text-center">
                    Highest <br /> Bid
                  </p>
                  <div className="bg-primary font-Forum font-bold text-[18px] px-2 text-secondary rounded-lg flex justify-center items-center w-full">
                    ฿ {product.highest_bid ?? 0}
                  </div>
                </div>
                <div className="flex space-x-2 bg-primary border-2 border-primary rounded-lg p-1 w-full">
                  <p className="font-Forum w-full leading-tight text-[20px] text-secondary text-center">
                    Buy Now
                  </p>
                  <div className="bg-secondary font-Forum font-bold text-[18px] px-2 text-primary rounded-lg flex justify-center items-center w-full">
                    ฿ {product.buy_now ?? 0}
                  </div>
                </div>
              </div>

              <p className="text-center px-4 py-2 font-Montserrat font-bold text-[14px] text-gray-700">
                Ends in: {countdown}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
