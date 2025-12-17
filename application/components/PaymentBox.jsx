"use client";

import { useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { handleCancel, payMoney } from "../app/(dashboard)/action";
import { redirect } from "next/navigation";

export default function PaymentBox({ open, onClose, amount, files }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handlePay = async () => {
    setLoading(true);

    // simulate payment / call Razorpay here
  
    const data = await payMoney(files);

    setLoading(false)

    if(data.success){
      alert(data.message);
    }
    else{
      alert("Something went wrong!!!!")
    }
    onClose()
    window.location.href='/'
   
    


  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-xl">

        {/* Loading state */}
        {loading ? (
          <div className="flex h-[220px] flex-col items-center justify-center">
            <span className="text-lg font-medium text-gray-700">
              Processing payment…
            </span>
            <span className="mt-2 text-sm text-gray-400">
              Please do not close this window
            </span>
          </div>
        ) : (
          <>
            {/* Amount */}
            <div className="flex items-center justify-center gap-1 py-6 text-4xl font-semibold text-gray-900">
              <FaIndianRupeeSign className="text-3xl" />
              {(Number.parseFloat(amount+.00)/100).toFixed(2)}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePay}
                className="h-11 rounded-xl bg-green-600 text-lg font-medium text-white
                           hover:bg-green-700 transition"
              >
                Pay Now
              </button>

              <button
                onClick={() =>onclose}
                className="h-11 rounded-xl border border-gray-300 text-lg
                           text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
