"use client";
import GreenSpinner from "../../components/CircleLoader";
import { useEffect, useState } from "react";
import { calculateAmountServer, getSignedUploadUrls } from "./action";
import  PrinterStatus  from "../../components/PrinterStatusBar";
import FileCard from "../../components/FIleCard";
import { uploadToGCS } from "../../lib/uploadToGCS";
import { deleteFile } from "./action.server";
import PaymentBox from "../../components/PaymentBox";

const Homepage = () => {
  
  const [BW_PRINTER_STATUS, setBW_PRINTER_STATUS] = useState('READY');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPayBox , setShowPayBox] = useState(false);
  const [amount , setAmount] = useState("");
  const [printer, setPrinter] = useState();
  const [files, setFiles] = useState([]);

  useEffect(()=>{
      console.log(files)

  },[files])
  


useEffect(() => {
  const fetchPrinterStatus = async () => {
    try {
      const res = await fetch("/api/printer/condition?type=BW_1");
      const data = await res.json();

      if (data.success) {
        const { printer } = data;
        setPrinter(printer);

        // better: store the actual status
        setBW_PRINTER_STATUS(printer.status);
      }
    } catch (error) {
      console.error("Failed to fetch printer status", error);
    }
  };

  fetchPrinterStatus();
}, []);



    const allowedTypes = [
    "application/pdf",
    ];




async function calculateAmount() {
  setIsCalculating(true);

  const a = await calculateAmountServer(files);
  setAmount(a);

  setIsCalculating(false);
  setShowPayBox(true);

}




 async function handleFiles (e){

  //filer the files based on type
   const selectedFiles = Array.from(e.target.files).filter(file=>allowedTypes.includes(file.type));
    // handle the files
    // get the uploadUrls and then i have to uplaod it to Bucket then get the public url and send it along with the metadata of each files 

    //here i am getting the public url and the upload url
    const urls = await getSignedUploadUrls(selectedFiles);
    console.log(urls);



    
    const validFiles = selectedFiles.map((file,i)=>{

      //creating a random to identify the file selected
      const id = crypto.randomUUID();
      //get the uploadUrl and the fileurl for each file

      const {uploadUrl, fileUrl} = urls[i];
      
      return{

        id,
        file,
        uploadUrl,
        fileUrl,
        copies: 1,
        color: "BLACK_WHITE",      
        doubleSide: false, 
        orientation:"PORTRAIT",
        pagesRange:"ALL",
        pagesCustomValue :"",

        uploadStatus: "uploading",
        uploadProgress: 0,

    }})
    setFiles(prev=>[...prev,...validFiles])



    // MAIN PART
    validFiles.forEach(f=>{
       uploadToGCS({
          file:f.file,
          uploadUrl:f.uploadUrl,
          onProgress:p=>{
            setFiles(prev=>prev.map(x=>x.id===f.id?{...x,uploadProgress:p}:x))
          }
          ,
          onSuccess: () => {
          setFiles(prev =>
            prev.map(x =>
              x.id === f.id ? { ...x, uploadStatus: "uploaded" } : x
            )
          );
        },
        onError: () => {
          setFiles(prev =>
            prev.map(x =>
              x.id === f.id ? { ...x, uploadStatus: "error" } : x
            )
          );
        }
      
      
      })
    })

  }


   function update(id, key, value) {
    setFiles(prev =>
      prev.map((f) =>
        f.id === id ? { ...f, [key]: value } : f
      )
    );
  }

  async function removeFile(item) {
    //remove from google cloud bucket also
    setFiles(prev => prev.filter((f) => f.id !== item.id));
    await deleteFile(item.fileUrl)
    console.log(item.file.name +" deleted")

  }




  return <section className='flex flex-col  items-center py-3 w-full  h-full px-4 '>


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



        {/* PRINTER STATUS */}
        <PrinterStatus printer={printer}/>
         {BW_PRINTER_STATUS=='READY'&&<button
          disabled={isCalculating&&!files.every(file=>file.uploadStatus==="uploaded")}
          onClick={calculateAmount}
          className={`w-full py-3 rounded-2xl text-white font-bold transition flex justify-center items-center ${
            isCalculating
              ? " bg-green-400 cursor-not-allowed"
              : " bg-green-600 hover:bg-green-600 cursor-pointer "
          }`}
        >
          {isCalculating ? <div className="flex justify-center items-center gap-3 ">Calculating.. <GreenSpinner size={24}/></div> : "Calculate Amount"}
         
        </button>
      }
        </div>
      
      
        
      )}






        {/* WHEN NO FILES SELECTED */}

    {files.length==0 &&(
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
      
      
    














    



  </section>
} 

export default Homepage;