"use client";
import { useState, useEffect, useMemo } from "react";
import { NavbarPrimary } from "../../components/navbar/navbar_primary";
import { Rating } from "@mui/material";
import { useCountdown } from "@/lib/utilities/util_functions";
import { getArticleDetail, buyNowArticle } from "@/hooks/content_detail.api";
import { IContent } from "../../../interfaces/content_detail/content_detail.domain";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { ErrorToast } from "../components/ErrorToast";
import { SuccessToast } from "../components/SuccessToast";

export const ContentDetail = () => {
  // STATE
  const [articleDetail, setArticleDetail] = useState<IContent | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const params = useParams();
  const id = params?.id as string;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // SOCKET
  const socket = useMemo(() => io("http://localhost:5500"), []);

  // FETCH ARTICLE
  useEffect(() => {
    if (!id) return;
    async function fetchArticle() {
      try {
        const { data } = await getArticleDetail(id);
        setArticleDetail(data);
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    }
    fetchArticle();
  }, [id]);

  // SUBSCRIBE TO REALTIME BID UPDATES
  useEffect(() => {
    socket.on("bidUpdate", (update) => {
      if (update.articleId === id) {
        setArticleDetail((prev) =>
          prev
            ? {
                ...prev,
                highest_bid: update.amount,
                bids: [
                  {
                    id: update.bidId,
                    ref_user: {
                      _id: update.userId,
                      name: update.userName,
                      img_url: update.userImg,
                      rating: update.userRating,
                    },
                    amount: update.amount,
                    timestamp: update.timestamp,
                  },
                  ...(prev.bids || []),
                ],
              }
            : prev
        );
      }
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [id, socket]);


  // COUNTDOWN
  const countdown = useCountdown(articleDetail?.ends_in || '');
  const parseCountdown = (countdownStr: string) => {
    if (countdownStr === "Expired")
      return { days: "00", hours: "00", mins: "00", secs: "00" };
    const parts = countdownStr.split(" ");
    return {
      days: parts[0] || "00",
      hours: parts[2] || "00",
      mins: parts[4] || "00",
      secs: parts[6] || "00",
    };
  };
  const { days, hours, mins, secs } = parseCountdown(countdown);

  // PLACE BID
  const handlePlaceBid = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/v1/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refId: id, amount: parseFloat(bidAmount) }),
      });
      

      if (res.status === 422) {
        const data = await res.json();
        setToastMessage(
          data.message || "The first bid must be at least the minimum bid."
        );
        return;
      }

      if (res.status === 409) {
        const data = await res.json();
        setToastMessage(
          data.message || "Bid must be higher than current highest bid."
        );
        return;
      }

      const data = await res.json();
      if (!data.success) {
        setToastMessage(data.message || "Bid failed");
      } 

      if (data.success) {
        setBidAmount("");
        setSuccessMessage(" Bid placed successfully!");
      }

    } catch (err) {
      console.error("Error placing bid:", err);
      setToastMessage("Server error while placing bid.");
    }
  };


  // QUICK BID
  const handleQuickBid = (multiplier: number) => {
    const newBid = Math.ceil((articleDetail?.highest_bid || 0) * multiplier);
    setBidAmount(newBid.toString());
  };

  // BUY NOW
  const handleBuyNow = async () => {
    try {
      const { data } = await buyNowArticle(id);
      if (data.success) {
        setArticleDetail(data.article);
        setSuccessMessage("🎉 Congratulations! You are the Winner");
      } else {
        setToastMessage(data.message || "Buy Now failed");
      }
    } catch (err) {
      console.error("Error buying article:", err);
      setToastMessage("Something went wrong while buying the article.");
    }
  };


  //-------
  // RENDER
  //-------

  return (
    <div className="min-h-screen bg-secondary">
      <NavbarPrimary user={"buyer"} />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* IMAGE */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-6">
          <img
            src={articleDetail?.img_url || "/imgs/placeholder.png"}
            alt="Content Image"
            className="w-full h-100 object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE */}
          <div className="lg:w-1/2">
            {/* Title + Author */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h1 className="text-2xl lg:text-3xl font-Forum text-primary mb-6 leading-tight">
                {articleDetail?.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-Montserrat">
                    Author
                  </span>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={
                        articleDetail?.author?.img_url ||
                        "/imgs/default-avatar.png"
                      }
                      alt={articleDetail?.author?.name || "Unknown"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-Montserrat font-semibold text-primary text-lg">
                      {articleDetail?.author?.name || "Unknown Author"}
                    </p>
                    <Rating
                      name="author-rating"
                      value={articleDetail?.author?.rating || 0}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-Montserrat text-gray-700">
                    {articleDetail?.date &&
                      new Date(articleDetail.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-Forum text-primary">Synopsis</h2>
                <div className="flex flex-wrap gap-2">
                  {articleDetail?.tag?.genre.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-tertiary text-primary rounded-full text-sm font-Montserrat border border-primary"
                    >
                      {g.keyword}
                    </span>
                  ))}
                  {articleDetail?.tag?.writing_style.map((w, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-tertiary text-primary rounded-full text-sm font-Montserrat border border-primary"
                    >
                      {w.keyword}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 font-Montserrat leading-relaxed text-justify">
                {articleDetail?.synopsis}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              {/* Highest Bid */}
              <div className="mb-6">
                <h3 className="text-xl font-Forum text-primary mb-4">
                  Highest Bid
                </h3>
                {articleDetail?.bids && articleDetail.bids.length > 0 ? (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                      <img
                        src={
                          articleDetail.bids[0].ref_user?.img_url ||
                          "/imgs/default-avatar.png"
                        }
                        alt={articleDetail.bids[0].ref_user?.name || "Bidder"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-Montserrat font-semibold text-lg">
                        {articleDetail.bids[0].ref_user?.name}
                      </p>
                      <p className="text-3xl font-Forum font-bold text-primary">
                        ฿{articleDetail.bids[0].amount}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>No bids yet</p>
                )}

                {/* Bid History */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-Montserrat font-semibold text-gray-600 mb-3">
                    Bid History
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {articleDetail?.bids?.map((bid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-Montserrat text-gray-700 flex items-center gap-2">
                          <img
                            src={
                              bid.ref_user?.img_url ||
                              "/imgs/default-avatar.png"
                            }
                            alt={bid.ref_user?.name || "Bidder"}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {bid.ref_user?.name}
                        </span>
                        <span className="font-semibold text-primary">
                          ฿{bid.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Countdown */}
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
                  <div className="text-2xl font-bold text-gray-400">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-Forum">
                      {secs}
                    </div>
                    <div className="text-sm text-gray-600 font-Montserrat">
                      Secs
                    </div>
                  </div>
                </div>
              </div>

              {/* Bidding Actions */}
              <div className="space-y-4">
                {/* Quick Bids */}
                <div className="flex gap-2 justify-center">
                  {[5.0, 2.0, 1.5].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleQuickBid(m)}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-Montserrat hover:bg-opacity-90 transition-colors"
                    >
                      {m}x
                    </button>
                  ))}
                </div>

                {/* Custom Bid */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter Amount"
                    min={(articleDetail?.highest_bid || 0) + 1}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-Montserrat focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={handlePlaceBid}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-Montserrat font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Place a bid
                  </button>
                </div>

                {/* Buy Now */}
                <div className="border-t-2 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-lg font-Forum text-primary">
                        Buy Price
                      </p>
                      <p className="text-4xl font-Forum font-bold text-primary">
                        ฿{articleDetail?.buy_now}
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

      {toastMessage && (
        <ErrorToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );}