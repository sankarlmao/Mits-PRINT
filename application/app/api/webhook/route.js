import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import crypto from "crypto"
import { Verified } from "lucide-react";
import { NextResponse } from "next/server";
export async function POST(req){
    
    try{

        //get the webhook_secret key
        const webhookSecretKey = process.env.RAZORPAY_WEBHOOK_SECRET;
        if(!webhookSecretKey){
            throw new Error("RAZORPAY_WEBHOOK_SECRET missing");

        }

        //recive the body
        const rawBody = await req.text();

        const razorpaySignature = req.headers.get("x-razorpay-signature") || "";
    
        const expectedSignature = crypto.createHmac("sha256",webhookSecretKey).update(rawBody).digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(razorpaySignature)
        );

        if(!isValid){
            console.error("Razorpay error webhook signature ");
            return NextResponse.json({recieved:false},{status:400});

        }
        

        const event = JSON.parse(rawBody);

        //PAYMENT CAPTURED
        if(event.event ==="payment.captured"){
            const paymentEntity = event.payload.payment.entity;

            const razorpayOrderId = paymentEntity.order_id; 
            const razorpayPaymentId = paymentEntity.id;
            const method = paymentEntity.method;
               
            

            //find the payment with the given razorpayOrderid
            const payment = await prisma.payment.findUnique({
                where:{razorpayOrderId}
            })
            if(!payment){
                 console.error("Payment not found:", razorpayOrderId);
                 return NextResponse.json({ received: true });
            }

            if(payment.status==="PAID"){
                return NextResponse.json({received:true})
            }

            //update the payment status to success then
            await prisma.$transaction([
                prisma.payment.update({
                    where:{id:payment.id},
                    data:{
                        status:"PAID",
                        razorpayPaymentId,
                        method,
                        verified:true,
                    }
                }),
                prisma.order.update({

                where:{
                    id:payment.orderId

                },
                data:{
                    paymentStatus:"PAID",

                }
                })
            ])
        
        }

        // PAYMENT FAILED

        if(event.event==="payment.failed"){
                const paymentEntity = event.payload.payment.entity;

                const razorpayOrderId = paymentEntity.order_id;

                await prisma.$transaction([
                    
                    prisma.payment.update({
                        where:{
                            razorpayOrderId,
                            status:"PENDING"
                        },
                        data:{
                            status:"FAILED"
                        }
                    })
                ])
            }
    
    return NextResponse.json({recieved:true});
    }catch(error){
        console.error("Razorpay webhook error occcured",error);
        return NextResponse.json({ received: true });    }
}