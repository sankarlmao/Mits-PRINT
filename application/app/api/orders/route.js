import Razorpay from "razorpay";
import { NextResponse } from "next/server";


export async function POST(req) {
   
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys not configured" },
      { status: 500 }
    );
  }
    const body = await req.json();

    const {amount} = body;
    console.log(amount)



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


  const order = await razorpay.orders.create({
    amount:amount, 
    currency: "INR",
    receipt: "order_rcptid_1",
  });

  return NextResponse.json(order);
}