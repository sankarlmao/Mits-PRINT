import { NextResponse } from "next/server";
import { razorpay } from "../../../utils/razorpay";


export async function POST(req) {
   
  try{
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys not configured" },
      { status: 500 }
    );
  }
    const body = await req.json();

    const {amount} = body;

  const order = await razorpay.orders.create({
    amount:amount, 
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return NextResponse.json(order);



  }catch(er){
   return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }



}