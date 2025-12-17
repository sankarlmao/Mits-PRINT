import { getSession } from "next-auth/react"
import { prisma } from "../lib/prisma"
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { generate5DigitCode } from "./otp";

export  async function createOrder(items){

  //FIND USER 
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
    },
  });


  
}



export async function getOrderfromDB(){

const orders = await prisma.order.findMany({
  where: {
    prints: {
      some: {
        status: "PENDING",
      },
    },
  },
  include: {
    prints: {
      where: {
        status: "PENDING",
      },
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


await prisma.print.updateMany({
  where: {
    orderId: { in: orders.map(o => o.id) },
    status: "PENDING",
  },
  data: {
    status: "PRINTING",
  },
});



return orders;



}