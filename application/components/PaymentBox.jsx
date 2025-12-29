"use client";
import axios from 'axios'
import { getSignedUploadUrls, startUploadMetaData } from "../app/(dashboard)/action";
import { useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import UploadProgressBar from "./UploadProgressBar";


export default function PaymentBox({ open, onClose, amount, files }) {
  const [loading, setLoading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [allUploaded, setAllUploaded] = useState(false);
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
              const uploads = await  getSignedUploadUrls(files)
              console.log(uploads)
              for (let i = 0; i < files.length; i++) {
                setCurrentFileIndex(i);
                setProgress(0);

                await axios.put(uploads[i].uploadUrl, files[i].file, {
                  headers: { "Content-Type": files[i].file.type },
                  onUploadProgress: (e) => {
                    setProgress(Math.round((e.loaded * 100) / e.total));
                  },
                });
              }

              setAllUploaded(true);
              const data = await startUploadMetaData(files,uploads)
            if(data.success){
                  setLoading(false)
                  onClose()
                  window.location.href=`/myprints?order_id=${data.orderId}`
          
            }
            else{
              alert("Something went wrong!!!!")
            }
           
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
            <UploadProgressBar
              file={files[currentFileIndex]?.file}
              progress={progress}
              allUploaded={allUploaded}
            />
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
                Procced
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

