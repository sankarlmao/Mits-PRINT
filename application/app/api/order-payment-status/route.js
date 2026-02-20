import { NextResponse } from "next/server"

export async function GET(req){
    const {searchParams} = new URL(req.url)
    console.log(searchParams.get("orderId"))

    //db-
    return NextResponse.json({status:"FAILED", },{status:200})
}