

export function uploadToGCS({file,uploadUrl,onProgress,onSuccess,onError}){
    const xhr = new XMLHttpRequest();

    xhr.open("PUT",uploadUrl);
    xhr.setRequestHeader("Content-type",file.type);

    xhr.upload.onprogress=e=>{
        if(e.lengthComputable){
            const percent = Math.round((e.loaded/e.total)*100);
            onProgress(percent);
        }
    };


    xhr.onload=()=>{
        if(xhr.status===200) onSuccess();
        else onError();
    };

    xhr.onerror = ()=>onError();

    xhr.send(file);
}