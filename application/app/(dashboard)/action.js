

import { getPdfPageCount } from "../../lib/getPagesCount"


export async function handleCancel(onClose){

    onClose()
    
}



export async function calculateAmountServer(files){

    const selectedFiles = await Promise.all(
    files.map( async file=>({
        
            
            pageCount: await getPdfPageCount(file.file),
            color:file.color,
            copies:file.copies,
            doubleSide:file.doubleSide,
            pagesRange:file.pagesRange,
            pagesCustomValue :file.pagesCustomValue

        }
    ))
    )
   

    

    //calculate cost

    let totalCost = 0
     selectedFiles.map(file=>{

        //BLACK_WHITE
        if(file.color==="BLACK_WHITE"){
            let per_page = 150 //1.5 in rupee
            
            if(!file.doubleSide){
                totalCost += per_page*file.pageCount*file.copies

            }
            else{
                totalCost += per_page*file.pageCount*file.copies*2

            }
        }

        //COLOR

        else{
            let per_page = 300 //3  in rupee
            
            if(!file.doubleSide){
                totalCost += per_page*file.pageCount*file.copies

            }
            else{
                totalCost += per_page*file.pageCount*file.copies*2

            }
        }
    })

    totalCost += 200 //extra page

    return totalCost

}




export  async function startUploadMetaData(files,uploads) {


    const dataWithOutFILE = files.map(({ file, ...rest }) => rest);

    const fileUrls = uploads.map(u=>u.fileUrl)
    
    const metadata = dataWithOutFILE.map((item,index)=>({
        ...item,
        fileUrl:fileUrls[index]
    }))

    const formData = new FormData();
     metadata.forEach(item => {
    formData.append("metadata", JSON.stringify(item));
    });


    const res = await fetch('/api/upload', {
        method:"POST",
        body:formData
    })


    const data = await res.json();

    return data;
}





export async function getSignedUploadUrls(fils){



const files = fils.map(file=>file.file)
console.log(files)
const formData = new FormData();


//adding all files array to formData with key files
files.forEach(file => {
  formData.append("files", file);
});



     const res = await fetch('/api/uploader', {
    method: 'POST',
    body: formData,
    });


    const { uploads } = await res.json();

    return uploads;
    }