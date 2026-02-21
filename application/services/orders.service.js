import { getSession } from "next-auth/react"
import { prisma } from "../lib/prisma"
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { generate5DigitCode } from "./otp";

export  async function createOrder(items,razorpayOrder){

  //items->file 
  //razorpayOrder the payment details
  //FIND USER 

  console.log(razorpayOrder)
  const session = await getServerSession(authOptions)
  const user = await prisma.student.findUnique({
    where:{
      email:session.user.email
    }
  })

  const otpCode = generate5DigitCode()

  const currentOrder = await prisma.order.create({
    data: {
      otpCode,
      studentId: user.id,
      prints: {
        create: items.map(item => ({
          fileUrl: item.fileUrl,
          colorMode: item.color,
          printOnBothSides: item.doubleSide,
          copies: item.copies,
          orientation: item.orientation,
          pageRange: item.pagesRange,
          customRange: item.customRange,
        })),
      },
      payment: {
        create:{
          amount:razorpayOrder.amount,
          razorpayOrderId:razorpayOrder.id,
          studentId:user.id
        }
       }
    },
  });


  return currentOrder.id
  
}



export async function getOrderfromDB(){

const orders = await prisma.order.findMany({
  where: {
        status: "PENDING",
        paymentStatus:"PAID"
    },
  include: {
    prints: {
    },
    student:{
        select:{
          id:true,
          email:true,
          name:true,
        }
      }  },
});

//after recieving there orders i have to put the status 


await prisma.order.updateMany({
  where: {
    id: { in: orders.map(o => o.id) },
    status: "PENDING",
  },
  data: {
    status: "PRINTING",
  },
});



return orders;



}


export async function updateOrderStatus(data){

  const {orderId , orderStatus} = data;

  const orders = await prisma.order.update({
    where:{id:orderId},
    data:{
      status:orderStatus
    },
    include:{
        prints:{
          select:{
            fileUrl:true
          }
        }
    }
  });

  const {prints} = orders;
  if(orders) return prints;
  return [];
}