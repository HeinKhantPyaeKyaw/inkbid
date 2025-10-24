"use client";

import { useBuyerDashboardAPI } from "@/hooks/buyer-dashboard-hooks/buyer-dashboard.api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "react-hot-toast";

function PayPalSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { capturePayPalOrderAPI } = useBuyerDashboardAPI();

  useEffect(() => {
    const orderId = searchParams.get("token"); // PayPal order token
    const articleId = localStorage.getItem("currentArticleId"); // stored when "Proceed Payment" clicked

    if (orderId && articleId) {
      console.log("🕓 Waiting before capture...");
      setTimeout(async () => {
        try {
          const res = await capturePayPalOrderAPI(orderId, articleId);

          if (res.success) {
            toast.success("✅ Payment completed successfully!");
            router.push("/dashboard/buyer-dashboard");
          } else {
            toast.error("⚠️ Payment could not be finalized.");
            router.push("/dashboard/buyer-dashboard");
          }
        } catch (err) {
          console.error("❌ Capture error:", err);
          toast.error("Payment failed. Please try again.");
          router.push("/dashboard/buyer-dashboard");
        }
      }, 2000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-semibold text-green-600 mb-2">
        Processing your payment...
      </h2>
      <p className="text-gray-600">Please wait while we finalize your order.</p>
    </div>
  );
}

export default function PayPalSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h2 className="text-xl text-gray-700">Loading payment status...</h2>
        </div>
      }
    >
      <PayPalSuccessContent />
    </Suspense>
  );
}
