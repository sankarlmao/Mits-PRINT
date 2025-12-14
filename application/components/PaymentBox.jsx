"use client";
import { handleCancel } from "../app/(dashboard)/action";
export default function PaymentBox({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"

      />

      {/* Modal box */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md h-[300px] max-w-[400px]  flex flex-col justify-center ">
        


      <div className="flex flex-col gap-3">
          <button className="h-12 w-full bg-green-500 rounded-xl text-2xl text-white cursor-pointer">Pay</button>
        <button className="h-12 w-full bg-red-500 rounded-2xl text-2xl text-white cursor-pointer" onClick={handleCancel}>Cancel</button>
      
      </div>
      </div>
    </div>
  );
}
