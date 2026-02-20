"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getWithExpiry, removeItem } from "@/utils/tempStorageLocal";

export default function VerifyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId");

  const [status, setStatus] = useState("VERIFYING");

  useEffect(() => {
    const printOrderId =
      orderIdFromQuery || getWithExpiry("printOrderId");

    if (!printOrderId) {
      router.replace("/"); // fallback
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/order-payment-status?orderId=${printOrderId}`
        );
        const data = await res.json();

        if (data.status === "PAID") {
          clearInterval(interval);
          removeItem("printOrderId");
          router.replace(`/myprints?order_id=${printOrderId}`);
        }

        if (data.status === "FAILED" || data.status === "EXPIRED") {
          clearInterval(interval);
          removeItem("printOrderId");
          router.replace(`/payment-failed?orderId=${printOrderId}`);
        }
      } catch (err) {
        console.error("Verification error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderIdFromQuery, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm text-center">
        <div className="animate-spin mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gray-300 border-t-green-500" />

        <h2 className="text-lg font-semibold text-gray-800">
          Verifying Payment
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Please wait while we confirm your payment.
          <br />
          Do not close this page.
        </p>
      </div>
    </div>
  );
}