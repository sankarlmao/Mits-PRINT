"use client";
import axios from 'axios'
import { getSignedUploadUrls, startUploadMetaData } from "../app/(dashboard)/action";
import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import UploadProgressBar from "./UploadProgressBar";
import GreenSpinner from './PriceLoadingAnimation';


export default function PaymentBox({ open, onClose, amount, files }) {
  const [loading, setLoading] = useState(false);
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [allUploaded, setAllUploaded] = useState(false);


  useEffect(()=>{
 
  })
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

          const verify = await res.json();

            if (verify.success) {

              //upload metadata to SERVER
              const data=   await startUploadMetaData(files)

            //show screen
              
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
    onClose()
    rzp.open();
  }

    const handlePay = async () => {

      setRazorpayLoading(true);
      loadRazorpay()
      setRazorpayLoading(false)


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
                disabled={razorpayLoading}
                className={`h-11 rounded-xl  text-lg font-medium text-white  transition cursor-pointer ${razorpayLoading?"bg-gray-400":"bg-green-500"}
                           `}
              >
                {razorpayLoading?<div className='flex justify-center items-center gap-3'><GreenSpinner size={26}/></div>:"Procced to Pay"}
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

