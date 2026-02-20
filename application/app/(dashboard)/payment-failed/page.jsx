"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { removeItem } from "@/utils/tempStorageLocal";
import { FaTimesCircle, FaRedo, FaArrowLeft } from "react-icons/fa";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const handleRetry = () => {
    // clear old temp data before retry
    removeItem("printOrderId");

    // redirect user back to checkout / uploads page
    router.push("/"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white max-w-sm w-full rounded-xl shadow-md p-6 text-center">
        
        {/* Icon */}
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-800">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-sm text-gray-500 mt-2">
          Unfortunately, your payment could not be completed.
          <br />
          No money has been deducted.
        </p>

        {/* Order info */}
        {orderId && (
          <p className="mt-3 text-xs text-gray-400">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 h-11 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            <FaRedo />
            Retry Payment
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 h-11 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}