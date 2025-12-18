"use client";

import { startUpload } from "../app/(dashboard)/action";
import { useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";


export default function PaymentBox({ open, onClose, amount, files }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

    const loadRazorpay = async () => {
    const res = await fetch("/api/orders", { method: "POST",body:JSON.stringify({amount:amount}) });
    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "MITS PRINT",
      order_id: order.id,
      handler: async function (response) {
            const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const d = await res.json();

            if (d.success) {

            //show screen
              setLoading(true);
            const data = await startUpload(files);

            if(data.success){
              // alert(data.message);
            }
            else{
              alert("Something went wrong!!!!")
            }
            setLoading(false)
            console.log(data);
            window.location.href=`/myprints?order_id=${data.orderId}`
    
            } 
            else {
              alert("Payment verification failed");
            }
    },

      theme: { color: "#3399cc" },
    };
  const rzp = new (window).Razorpay(options);
    rzp.open();
  }

    const handlePay = async () => {

        
  
      loadRazorpay()
  



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
               Sending this file to MITS STORE PC Please wait .....
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
                onClick={onClose}
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

