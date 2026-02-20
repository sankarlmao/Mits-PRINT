import { NextResponse } from "next/server";
import { razorpay } from "../../../utils/razorpay";
import { createOrder } from "../../../services/orders.service";


export async function POST(req) {
   
  try{
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys not configured" },
      { status: 500 }
    );
  }
    const body = await req.json();

    const {amount,files} = body;
    
  const razorpayOrder = await razorpay.orders.create({
    amount:amount, 
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  console.log(razorpayOrder)

  //add the files to db and get the orderId (purchase id)
  const printOrderId = await createOrder(files,razorpayOrder)


  
  return NextResponse.json({razorpayOrder,printOrderId});



  }catch(er){
   return NextResponse.json(
      { error: "Failed to create payment order" ,
        mess:er.message
      },
      { status: 500 }
    );
  }



}