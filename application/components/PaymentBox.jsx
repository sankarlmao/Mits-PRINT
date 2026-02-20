"use client";
import axios from 'axios'
import { getSignedUploadUrls, startUploadMetaData } from "../app/(dashboard)/action";
import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import UploadProgressBar from "./UploadProgressBar";
import GreenSpinner from './PriceLoadingAnimation';
import { loadScript } from '@/utils/loadScript.razorpay';
import { getWithExpiry, setWithExpiry } from '@/utils/tempStorageLocal';
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentBox({ open, onClose, amount, files }) {
  const [loading, setLoading] = useState(false);
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [allUploaded, setAllUploaded] = useState(false);


  const router = useRouter();
  useEffect(()=>{
 
  })
  if (!open) return null;

    const loadRazorpay = async () => {
      console.log(files)
    const res = await fetch("/api/orders", { method: "POST",body:JSON.stringify({amount:amount,files}) });
    const {razorpayOrder, printOrderId} = await res.json();
    console.log(printOrderId+"from frontend")
    setWithExpiry("printOrderId", printOrderId, 10 * 60 * 1000);
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      description:"Pay the amount to confirm the order",
      name: "MITS PRINT",
      image:"/mitsprint.png",
      order_id: razorpayOrder.id,
      handler: async function (response) {
          const orderId = getWithExpiry("printOrderId");
          router.push(`/verifying-payment?orderId=${orderId}`);
    },

      theme: { color: "#3399cc" },
    };
  const rzp = new (window).Razorpay(options);
    onClose()
    rzp.open();
    rzp.on('payment.failed',(res)=>{
      window.alert('Payment failed')
    })
  }

    const handlePay = async () => {
      
      setRazorpayLoading(true);

      try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) window.alert("Razorpay failed to open. check your network and try again");
        
        loadRazorpay()


      }catch(err){
        console.log(err)
      }

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

