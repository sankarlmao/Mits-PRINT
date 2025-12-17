

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




export  async function payMoney(files) {


    const dataWithOutFILE = files.map(({ file, ...rest }) => rest);

    const filesOnly = files.map(file=>file.file)
    const uploadUrls = await uploadToGCS(filesOnly);
  
    const metadata = dataWithOutFILE.map((item,index)=>({
        ...item,
        fileUrl:uploadUrls[index]
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





export async function uploadToGCS(files){

console.log(files)
const formData = new FormData();


//adding all files array to formData with key files
files.forEach(file => {
  formData.append("files", file);
});


console.log('Hi', formData.getAll('files'))

     const res = await fetch('/api/uploader', {
    method: 'POST',
    body: formData,
    });


    const { uploads } = await res.json();

  // 2️⃣ Upload files directly to GCS
    await Promise.all(
        uploads.map((u, i) =>
        fetch(u.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": files[i].type },
            body: files[i],
        })
        )
    );

  return uploads.map(u => u.fileUrl);
    }