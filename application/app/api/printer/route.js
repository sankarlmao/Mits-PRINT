import { NextResponse } from "next/server";

export async function POST(req){

    const body = await req.json();
    
    try{
    const {SECRET_KEY} = body;


    if(SECRET_KEY != process.env.SECRET_KEY){
        return NextResponse.json({message:"YOU ARE NOT AUTH TO GET THIS"})
    }
    }catch(error){
        
        return NextResponse.json({message:"unexpected error occured "});

    }
}