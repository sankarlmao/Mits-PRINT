import { updatePrinterStatus } from "../../../services/printer.service";
import { NextResponse } from "next/server";

export async function POST(req){

    
    try{

    const body = await req.json();

    const {SECRET_KEY} = body;


    if(SECRET_KEY != process.env.SECRET_KEY){
        throw e
    }

    const res = await updatePrinterStatus(body)

    if(!res)
        return NextResponse.json({message:"Updation failed"})
    
    
    return NextResponse.json({message:"Updation Successfull", updationStatus: true})

    
    }catch(error){
        
        return NextResponse.json({message:"unexpected error occured "});

    }
}