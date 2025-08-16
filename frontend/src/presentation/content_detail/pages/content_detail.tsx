"use client";
import { useState } from "react";
import { NavbarPrimary } from "../../components/navbar/navbar_primary";
import { Rating } from "@mui/material";
import { useCountdown } from "@/lib/utilities/util_functions";

interface ContentDetailProps {
  contentData?: any;
}

export const ContentDetail = ({ contentData }: ContentDetailProps) => {
  const [bidAmount, setBidAmount] = useState("");

  // Mock data - replace with contentData when API is ready
  const mockData = {
    id: "1",
    title:
      "The equilibrium of high income vs low income disparity heightens amidst ongoing tariff wars.",
    author: {
      name: "Arthur Bills",
      avatar: "/imgs/sample.jpg",
      rating: 3.5,
    },
    date: "29 April 2025",
    tags: ["Political", "Economics", "Recent"],
    synopsis:
      "This article explores how escalating global tariff wars are intensifying the economic divide between high-income and low-income populations. It analyzes the disproportionate impact of trade barriers on labor-intensive sectors, wage stagnation among lower earners, and the compounding advantages enjoyed by capital-heavy industries. Drawing on recent economic data and policy developments, the piece highlights how trade policy can unintentionally exacerbate income inequality, challenging the notion of equitable economic growth.",
    image: "/imgs/sample.jpg",
    due: "22/August/2025",
    highestBid: {
      amount: 150,
      bidder: "Alex Boman",
      avatar: "/imgs/sample.jpg",
    },
    buyPrice: 850,
    bidHistory: [
      { bidder: "Alex Boman", amount: 150, avatar: "/imgs/sample.jpg" },
      { bidder: "Durett Gurial", amount: 100, avatar: "/imgs/sample.jpg" },
      { bidder: "Sammet Johnson", amount: 50, avatar: "/imgs/sample.jpg" },
      { bidder: "Thomas Smiths", amount: 25, avatar: "/imgs/sample.jpg" },
    ],
  };

  const countdown = useCountdown(mockData.due);

  // Parse countdown string to get individual values
  const parseCountdown = (countdownStr: string) => {
    if (countdownStr === "Expired")
      return { days: "00", hours: "00", mins: "00" };

    const parts = countdownStr.split(" ");
    const days = parts[0] || "01";
    const hours = parts[2] || "02";
    const mins = parts[4] || "12";

    return { days, hours, mins };
  };

  const { days, hours, mins } = parseCountdown(countdown);

  const handlePlaceBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= mockData.highestBid.amount) {
      alert(
        `Bid must be higher than current highest bid of $${mockData.highestBid.amount}`
      );
      return;
    }
    console.log("Placing bid:", bidAmount);
    // Handle bid placement logic
  };

  const handleBuyNow = () => {
    console.log("Buying now for:", mockData.buyPrice);
    // Handle buy now logic
  };

  const handleQuickBid = (multiplier: number) => {
    const newBid = Math.ceil(mockData.highestBid.amount * multiplier);
    setBidAmount(newBid.toString());
  };

  return (
    <div className="min-h-screen bg-secondary">
      <NavbarPrimary user={"buyer"} />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Image */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-6">
          <img
            src={mockData.image}
            alt="Content Image"
            className="w-full h-100 object-cover rounded-lg"
          />
        </div>
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Image and Synopsis */}
          <div className="lg:w-1/2">
            {/* Title and Author Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h1 className="text-2xl lg:text-3xl font-Forum text-primary mb-6 leading-tight">
                {mockData.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-Montserrat">
                    Author
                  </span>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={mockData.author.avatar}
                      alt={mockData.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-Montserrat font-semibold text-primary text-lg">
                      {mockData.author.name}
                    </p>
                    <Rating
                      name="author-rating"
                      value={mockData.author.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-lg font-Montserrat text-gray-700">
                    {mockData.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-Forum text-primary">Synopsis</h2>
                <div className="flex flex-wrap gap-2">
                  {mockData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-tertiary text-primary rounded-full text-sm font-Montserrat border border-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 font-Montserrat leading-relaxed text-justify">
                {mockData.synopsis}
              </p>
            </div>
          </div>

          {/* Right Side - Content Details and Bidding */}
          <div className="lg:w-1/2">
            {/* Countdown and Bidding Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              {/* Highest Bid */}
              <div className="mb-6">
                <h3 className="text-xl font-Forum text-primary mb-4">
                  Highest Bid
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={mockData.highestBid.avatar}
                      alt={mockData.highestBid.bidder}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-Montserrat font-semibold text-lg">
                      {mockData.highestBid.bidder}
                    </p>
                    <p className="text-3xl font-Forum font-bold text-primary">
                      ฿{mockData.highestBid.amount}
                    </p>
                  </div>
                </div>

                {/* Bid History - Always Visible */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-Montserrat font-semibold text-gray-600 mb-3">
                    Bid History
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mockData.bidHistory.map((bid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-Montserrat text-gray-700">
                          {bid.bidder}
                        </span>
                        <span className="font-semibold text-primary">
                          ฿{bid.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <h3 className="text-xl font-Forum text-primary mb-4">
                  Ends In
                </h3>
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-Forum">
                      {days}
                    </div>
                    <div className="text-sm text-gray-600 font-Montserrat">
                      Days
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-Forum">
                      {hours}
                    </div>
                    <div className="text-sm text-gray-600 font-Montserrat">
                      Hours
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-Forum">
                      {mins}
                    </div>
                    <div className="text-sm text-gray-600 font-Montserrat">
                      Mins
                    </div>
                  </div>
                </div>

                {/* Progress Bar representing time remaining */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              {/* Bidding Section */}
              <div className="space-y-4">
                {/* Quick Bid Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleQuickBid(5.0)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-Montserrat hover:bg-opacity-90 transition-colors"
                  >
                    5.0x
                  </button>
                  <button
                    onClick={() => handleQuickBid(2.0)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-Montserrat hover:bg-opacity-90 transition-colors"
                  >
                    2.0x
                  </button>
                  <button
                    onClick={() => handleQuickBid(1.5)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-Montserrat hover:bg-opacity-90 transition-colors"
                  >
                    1.5x
                  </button>
                </div>

                {/* Custom Bid Input */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter Amount"
                    min={mockData.highestBid.amount + 1}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-Montserrat focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={handlePlaceBid}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-Montserrat font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Place a bid
                  </button>
                </div>

                {/* Buy Now Section */}
                <div className="border-t-2 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-lg font-Forum text-primary">
                        Buy Price
                      </p>
                      <p className="text-4xl font-Forum font-bold text-primary">
                        ฿{mockData.buyPrice}
                      </p>
                    </div>
                    <button
                      onClick={handleBuyNow}
                      className="px-8 py-3 bg-primary text-white rounded-lg font-Montserrat font-semibold hover:bg-opacity-90 transition-colors text-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
