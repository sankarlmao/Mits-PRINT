"use client";
import { useState } from "react";
import FileCard from "./FIleCard";
import PaymentBox from "./PaymentBox";
import { calculateAmountServer, payMoney } from "../app/(dashboard)/action";

export default function PrintLoader() {
  const [files, setFiles] = useState([]);

  const [showPayBox , setShowPayBox] = useState(false);
  const [amount , setAmount] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);


async function calculateAmount() {
  setIsCalculating(true);
  setShowPayBox(true);

  const a = await calculateAmountServer(files);
  setAmount(a);

  setIsCalculating(false);
}



  const allowedTypes = [
    "application/pdf",
  ];

  function handleFiles(e) {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles
      .filter(file => allowedTypes.includes(file.type))
      .map(file => ({
        file,
        copies: 1,
        color: "BLACK_WHITE",      
        doubleSide: false, 
        orientation:"PORTRAIT",
        pagesRange:"ALL",
        pagesCustomValue :""
      }));

    setFiles(prev => [...prev, ...validFiles]);
  }



  function update(index, key, value) {
    setFiles(prev =>
      prev.map((f, i) =>
        i === index ? { ...f, [key]: value } : f
      )
    );
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

 return (
  <div className="max-w-xl px-3 w-full mx-auto">

    <PaymentBox
      open={showPayBox}
      onClose={() => setShowPayBox(false)}
      amount={amount}
      files={files}
    />

    {/* EMPTY STATE */}
    {files.length === 0 && (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <h2 className="text-lg font-semibold">Start Printing</h2>

        <p className="text-sm text-gray-500">
          Upload your PDF files and customize print options
        </p>

        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={handleFiles}
          />
          <div className="px-6 py-4 bg-green-500 text-white rounded-xl font-semibold shadow">
            Upload PDF Files
          </div>
        </label>

        <p className="text-xs text-gray-400">
          Supported format: PDF
        </p>
      </div>
    )}

    {/* FILE LIST */}
    {files.length > 0 && (
      <div className="space-y-4 mt-4">

        

        {files.map((item, index) => (
          <FileCard
            key={index}
            item={item}
            index={index}
            update={update}
            removeFile={removeFile}
          />
        ))}
        <label className="cursor-pointer block">
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={handleFiles}
          />
          <div className="border-2 border-dashed rounded-xl py-4 text-center text-sm text-gray-500">
            + Add more files
          </div>
        </label>
        <button
          disabled={isCalculating}
          onClick={calculateAmount}
          className={`w-full py-3 rounded-2xl text-white font-bold transition ${
            isCalculating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isCalculating ? "Calculating..." : "Calculate Amount"}
        </button>
      </div>
    )}
  </div>
);
}

