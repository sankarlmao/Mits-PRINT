"use client"

import React, { useState } from 'react'

const FileCard = ({item, update, removeFile, index}) => {


    

    const [customValueClicked,setCustomValueClicked] = useState(false)
    
  return (
   <div
     
          className=" rounded-xl p-4 space-y-3 bg-white  min-w-[90%] h-fit shadow-sm"
        >
          <div className="font-medium truncate">
            {item.file.name}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">

            {/* Copies */}
            <div className="flex items-center gap-2">
              <span>Copies</span>
                 <select className="h-8 px-2 text-sm border rounded-md" onChange= { e=> update(item.id, "copies",Number.parseInt(e.target.value))}>
    {[1,2,3,4,5,6,7,8,9,10].map(n => (
      <option key={n} value={n}> {n}</option>
    ))}
  </select>
            </div>

            {/* Color */}
            <label className="flex items-center gap-1">
                Color mode
              <select
              className="h-8 px-2 text-sm border rounded-md"
                onChange={e =>
                  update(item.id, "color", e.target.value)
                }
              >
                <option value="BLACK_WHITE">B&W</option>
                {/* <option value='COLOR'>Color</option> */}
              </select>
            
            </label>

            {/* Double Side */}
           {item.color=="BLACK_WHITE"?
           <label className="flex items-center gap-1">
              <input
                className='h-5 w-6'
                type="checkbox"
                checked={item.doubleSide}
                onChange={e =>
                  update(item.id, "doubleSide", e.target.checked)
                }
              />
              Both sides
            </label>:"" 
          }


             {/* Orientation */}
            <label className="flex items-center gap-1">
                Orientation 
              <select
              className="h-8 px-2 text-sm border rounded-md"
                onChange={e =>
                  update(item.id, "orientation", e.target.value)
                }
              >
                <option value="PORTRAIT">Portrait</option>
                <option value="LANDSCAPE">LandScape</option>
              </select>
            
            </label>

             {/* Pages range */}
            <label className="flex items-center gap-1">
                PagesRange 
              <select
              className="h-8 px-2 text-sm border rounded-md"
                
                onChange={e =>{
                  update(item.id, "pagesRange", e.target.value)
                   if(e.target.value==="CUSTOM") setCustomValueClicked(true);
                   else setCustomValueClicked(false)
                }
                }
              >
                <option value="ALL">ALL</option>
                <option value="ODD">ODD</option>
                <option value="EVEN">EVEN</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>


            
            </label>


            {customValueClicked? 
            <label className="flex items-center gap-1">
                Range
             <input
  type="text"
  className="h-[23px] border outline-none border-gray-200 px-1 py-2 w-[100px] focus:border-green-400"
  placeholder="1-5"
  value={item.pagesCustomValue}
  onChange={(e) => {
    const value = e.target.value;

    // Allow only numbers and dash
    if (/^[0-9-]*$/.test(value)) {
      update(item.id, "pagesCustomValue", value);
    }
  }}
/>
            <p>Eg: 1-3 , 4-9 </p>
            </label> :""}
          
                


          </div>
          {/* Upload Progress */}
<div className="space-y-1">
  {/* Progress Bar */}
  <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
    <div
      className={`h-full transition-all duration-300 ${
        item.uploadStatus === "uploaded"
          ? "bg-green-500"
          : item.uploadStatus === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      }`}
      style={{ width: `${item.uploadProgress || 0}%` }}
    />
  </div>

  {/* Status Text */}
  <div className="flex justify-between text-xs text-gray-600">
    <span>
      {item.uploadStatus === "waiting" && "Waiting to upload"}
      {item.uploadStatus === "uploading" && "Uploading..."}
      {item.uploadStatus === "uploaded" && "Uploaded"}
      {item.uploadStatus === "error" && "Upload failed"}
    </span>
    <span>{item.uploadProgress || 0}%</span>
  </div>
</div>


          <button
            onClick={() => removeFile(item)}
            className="text-red-500 font-light text-lg cursor-pointer" 
          >
            Remove
          </button>
        </div>
  )
}

export default FileCard;