"use client";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { FaGoodreads } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

import { FiPackage, FiClock, FiShield } from "react-icons/fi";
import { MdOutlineVerified, MdPendingActions } from "react-icons/md";
import { formatDate } from "../utils/dateFormater";

export default function MyPrintsPage({data}) {
  const [showPopup, setShowPopup] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [handledOrderId, setHandledOrderId] = useState(null);

  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");


    useEffect(() => {
      setAllOrders(data)
      if (!order_id) return;
      if (handledOrderId === order_id) return;

      setHandledOrderId(order_id);
      showOrderPlacedMessage(order_id);
      
    }, [order_id, handledOrderId]);

  const showOrderPlacedMessage = async (orderId) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/myorders?order_id=${orderId}`,
        {
          method: "GET",
        }
      );
  
      const mes = await res.json();
      console.log(mes)
      if (mes.success) {
        setCurrentOrder(mes.data);
        setShowPopup(true);
      }
    }; 
  




  return (
    <div className=" h-screen flex flex-col items-center justify-start py-5">
      <div className="w-full max-w-4xl mx-auto px-4 ">
        {/* Heading */}
        <div className="mb-6 flex items-center gap-3 mt-3">
          <FiPackage className="text-green-600 text-3xl" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Print Order Details
          </h2>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-green-100 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <FiPackage />
                    Order ID
                  </p>

                  <p className="font-mono text-sm text-gray-800">
                    {order.id}
                  </p>

                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <FiClock />
                    {formatDate(order.createdAt) }
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <MdPendingActions className="text-yellow-500 text-xl" />
                  <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                    PENDING
                  </span>
                </div>

                {/* OTP */}
                <div className="text-center bg-green-50 rounded-xl px-6 py-3">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                    <FiShield />
                    OTP
                  </p>

                  <p className="font-mono text-lg font-bold tracking-widest text-green-700">
                    {order.otpCode}
                  </p>

                  <p className="mt-1 text-[11px] text-green-600 flex items-center justify-center gap-1">
                    <MdOutlineVerified />
                    Required for collection
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white py-8 px-6 rounded w-96 relative">
            <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
              Files Sent to MITS Store PC 
              <IoMdCheckmarkCircleOutline
                size={26}
                className="text-green-600"
              />
            </h2>

            <p className="text-gray-600">
              Kindly go to Mits Store and collect your print using the OTP for
              verification.
            </p>

            <p className="font-bold my-2">
              OTP : {currentOrder?.otpCode}
            </p>

            <span className="text-sm mt-3 text-gray-700 font-semibold">
              {formatDate(currentOrder.createdAt)}
            </span>

            <button
              onClick={() => {
                setShowPopup(false);
                setCurrentOrder(null)
                
                window.history.replaceState({}, "", "/myprints");              }}
              className="absolute top-2 right-2 text-gray-500 cursor-pointer"
            >
              <IoMdClose size={26} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
