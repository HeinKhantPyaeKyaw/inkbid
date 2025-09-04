"use client";
import { useCountdown } from "@/lib/utilities/util_functions";
import { IContent } from "../../interfaces/content/content.domain";
import { Rating } from "@mui/material";
import Link from "next/link";

interface ProductCardProps {
  props: IContent[];
}

const SingleProductCard = ({
  product,
  index,
}: {
  product: IContent;
  index: number;
}) => {
  const countdown = useCountdown(product.due); 

  return (
    <div className="flex flex-col w-[350px] h-[350px] overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="flex font-Forum">
        <img
          src="/imgs/sample.jpg"
          alt="Product Image"
          className="w-[150px] h-[150px] object-cover rounded-lg m-2 shadow-lg border-1"
        />
        <div className="flex flex-col w-full mt-1">
          <p className="text-[20px] leading-tight">{product.title}</p>
          <p className="text-[12px]">{product.date}</p>
          <div className="flex justify-between">
            <p className="text-[15px]">{product.author}</p>
            <Rating
              name={`rating-${index}`}
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
              className="pr-2"
            />
          </div>
          <div className="relative w-full h-0.25 bg-black bottom-0" />
          <div className="flex space-x-2 space-y-1 flex-wrap mt-1 text-black">
            <p className="px-2 flex items-center justify-center text-center bg-[#D9D9D9] rounded-full border-1 border-[#5C5C5C] text-[12px] h-[25px]">
              {product.genre}
            </p>
            <p className="px-2 flex items-center justify-center text-center bg-[#D9D9D9] rounded-full border-1 border-[#5C5C5C] text-[12px] h-[25px]">
              {product.writing_style}
            </p>
            <p className="px-2 flex items-center justify-center text-center bg-[#D9D9D9] rounded-full border-1 border-[#5C5C5C] text-[12px] h-[25px]">
              {product.tag}
            </p>
          </div>
        </div>
      </div>
      <p className="font-Montserrat text-[15px] px-4 line-clamp-3">
        {product.description}
      </p>
      <div className="flex justify-between items-center space-x-2 px-4 mt-2">
        <div className="flex space-x-2 bg-secondary border-2 border-primary rounded-lg p-1 w-full">
          <p className="font-Forum leading-tight w-full text-[20px] text-primary text-center">
            Highest <br /> Bid
          </p>
          <div className="bg-primary font-Forum font-bold text-[20px] px-2 text-secondary rounded-lg flex justify-center items-center w-full">
            ฿{product.highest_bid}
          </div>
        </div>
        <div className="flex space-x-2 bg-primary border-2 border-primary rounded-lg p-1 w-full">
          <p className="font-Forum w-full leading-tight text-[20px] text-secondary text-center">
            Buy Now
          </p>
          <div className="bg-secondary font-Forum font-bold text-[20px] px-2 text-primary rounded-lg flex justify-center items-center w-full">
            ฿{product.buy_now}
          </div>
        </div>
      </div>
      <p className="text-center px-4 py-2 font-Montserrat font-bold text-[16px]">
        Ends in: {countdown}
      </p>
    </div>
  );
};

export const ProductCard = ({ props }: ProductCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 justify-items-center">
      {props.map((product, index) => (
        <Link href={`/content/1`} key={index}>
          <SingleProductCard
            key={`${product.title}-${index}`}
            product={product}
            index={index}
          />
        </Link>
      ))}
    </div>
  );
};
