import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req){
    try{
           const {searchParams} = new URL(req.url)
   const orderId=  searchParams.get("orderId")

    //db-
    const order = await prisma.order.findUnique({
        where:{id:orderId}
    })
    return NextResponse.json({status:order.paymentStatus},{status:200})

    }catch(error){
        return NextResponse.json({error:error},{status:401})
    }
 }