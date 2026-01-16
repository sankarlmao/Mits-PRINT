"use client";

import GreenSpinner from "../../components/CircleLoader";
import { useEffect, useState } from "react";
import { calculateAmountServer, getSignedUploadUrls } from "./action";
import PrinterStatus from "../../components/PrinterStatusBar";
import FileCard from "../../components/FIleCard";
import { uploadToGCS } from "../../lib/uploadToGCS";
import { deleteFile } from "./action.server";
import PaymentBox from "../../components/PaymentBox";

const Homepage = () => {
  const [BW_PRINTER_STATUS, setBW_PRINTER_STATUS] = useState("READY");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPayBox, setShowPayBox] = useState(false);
  const [amount, setAmount] = useState("");
  const [printer, setPrinter] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log(files);
  }, [files]);

  useEffect(() => {
    const fetchPrinterStatus = async () => {
      try {
        const res = await fetch("/api/printer/condition?type=BW_1");
        const data = await res.json();

        if (data.success) {
          const { printer } = data;
          setPrinter(printer);
          setBW_PRINTER_STATUS(printer.status);
        }
      } catch (error) {
        console.error("Failed to fetch printer status", error);
      }
    };

    fetchPrinterStatus();
  }, []);

  const allowedTypes = ["application/pdf"];

  async function calculateAmount() {
    setIsCalculating(true);
    const a = await calculateAmountServer(files);
    setAmount(a);
    setIsCalculating(false);
    setShowPayBox(true);
  }


  async function handleFiles(e) {

    
    
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      
      
         allowedTypes.includes(file.type) &&file.size<10000000
      
    );


    if (selectedFiles.length === 0) return;

    // ---- PHASE 1: Optimistic UI (instant render) ----
    const tempFiles = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      uploadUrl: null,
      fileUrl: null,
      copies: 1,
      color: "BLACK_WHITE",
      doubleSide: false,
      orientation: "PORTRAIT",
      pagesRange: "ALL",
      pagesCustomValue: "",
      uploadStatus: "preparing",
      uploadProgress: 0,
    }));

    setFiles((prev) => [...prev, ...tempFiles]);

    // reset input so same file can be selected again
    e.target.value = "";

    // ---- PHASE 2: Get signed URLs + upload ----
    try {
      const urls = await getSignedUploadUrls(selectedFiles);

      tempFiles.forEach((tempFile, i) => {
        const { uploadUrl, fileUrl } = urls[i];

        // mark uploading + attach URLs
        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempFile.id
              ? {
                  ...f,
                  uploadUrl,
                  fileUrl,
                  uploadStatus: "uploading",
                }
              : f
          )
        );

        uploadToGCS({
          file: tempFile.file,
          uploadUrl,
          onProgress: (p) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id
                  ? { ...f, uploadProgress: p }
                  : f
              )
            );
          },
          onSuccess: () => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id
                  ? { ...f, uploadStatus: "uploaded", uploadProgress: 100 }
                  : f
              )
            );
          },
          onError: () => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === tempFile.id
                  ? { ...f, uploadStatus: "error" }
                  : f
              )
            );
          },
        });
      });
    } catch (err) {
      console.error("Upload init failed", err);
    }
  }

  function update(id, key, value) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  }

  async function removeFile(item) {
    setFiles((prev) => prev.filter((f) => f.id !== item.id));
    if (item.fileUrl) {
      await deleteFile(item.fileUrl);
      console.log(item.file.name + " deleted");
    }
  }

  return (
    <section className="flex flex-col items-center py-3 w-full h-full px-4">
      {files.length > 0 && (
        <div className="space-y-4 mt-4">
          <PaymentBox
            open={showPayBox}
            onClose={() => setShowPayBox(false)}
            amount={amount}
            files={files}
          />

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

          <PrinterStatus printer={printer} />

          {BW_PRINTER_STATUS === "READY" && (
            <button
              disabled={
                isCalculating ||
                !files.every((file) => file.uploadStatus === "uploaded")
              }
              onClick={calculateAmount}
              className={`w-full py-3 rounded-2xl text-white font-bold transition flex justify-center items-center ${
                isCalculating
                  ? " bg-green-400 cursor-not-allowed"
                  : " bg-green-600 hover:bg-green-600 cursor-pointer "
              }`}
            >
              {isCalculating ? (
                <div className="flex justify-center items-center gap-3">
                  Calculating.. <GreenSpinner size={24} />
                </div>
              ) : (
                "Calculate Amount"
              )}
            </button>
          )}
        </div>
      )}

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
            Supported format: PDF (Size &lt; 10MB)

          </p>
        </div>
      )}
    </section>
  );
};

export default Homepage;
