"use client";
import { useState } from "react";
import FileCard from "./FIleCard";
import PaymentBox from "./PaymentBox";
import { calculateAmountServer, payMoney } from "../app/(dashboard)/action";

export default function PrintLoader() {
  const [files, setFiles] = useState([]);

  const [showPayBox , setShowPayBox] = useState(false);
  const [amount , setAmount] = useState("");





  async function  calculateAmount(){

    // DEBUGGER
    console.log(files)

    setShowPayBox(true)
     const a =  await calculateAmountServer(files)
      setAmount(a)
     
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
    <div className={`max-w-xl space-y-4  px-3 w-full  ${files.length==0?"flex justify-center items-center h-screen":""}`} >


      <PaymentBox open={showPayBox} onClose={()=>setShowPayBox(false) } amount={amount} files={files}></PaymentBox>

      {/* Upload Box */}
      <label className=" rounded-lg p-5 text-center cursor-pointer ">
        <input
          type="file"
          multiple
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFiles}
        />
        <p className="text-sm  bg-blue-400 px-3 py-3 rounded-xl text-white">
          Upload PDF or DOCX files
        </p>
      </label>

      {/* File Cards */}
      {files.map((item, index) => (
        <FileCard item={item} key={index} update={update} removeFile={removeFile} index={index}/>
      ))}



    {files.length>0?  <button className="px-3 py-3 my-6 w-full bg-green-500 rounded-2xl mt-3 text-white font-bold cursor-pointer"  onClick={calculateAmount}>
        Calculate Amount
      </button>
      
    :""}

            

    </div>


    
  );
}


