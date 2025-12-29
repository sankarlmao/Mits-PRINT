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
                 <select className="h-8 px-2 text-sm border rounded-md" onChange= { e=> update(index, "copies",Number.parseInt(e.target.value))}>
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
                  update(index, "color", e.target.value)
                }
              >
                <option value="BLACK_WHITE">B&W</option>
                <option value='COLOR'>Color</option>
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
                  update(index, "doubleSide", e.target.checked)
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
                  update(index, "orientation", e.target.value)
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
                  update(index, "pagesRange", e.target.value)
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
      update(index, "pagesCustomValue", value);
    }
  }}
/>
            <p>Eg: 1-3 , 4-9 </p>
            </label> :""}
          
                


          </div>

          <button
            onClick={() => removeFile(index)}
            className="text-red-500 font-light text-lg cursor-pointer" 
          >
            Remove
          </button>
        </div>
  )
}

export default FileCard;