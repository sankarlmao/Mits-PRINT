

export  function  loadScript(src){
    return new Promise((resolve,reject)=>{
        const script = document.createElement("script");
        script.src = src;
        script.onload = ()=>{
            resolve(true)
        };
        script.onerror=()=>{
            reject(new Error("Something went wrong ! check our network"));
        }

        document.body.appendChild(script);
    })
}