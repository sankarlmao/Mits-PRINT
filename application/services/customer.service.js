import { prisma } from "../lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";


export async function getMyOrder(orderId){


      //FIND USER 
      const session = await getServerSession(authOptions)
      const user = await prisma.student.findUnique({
        where:{
          email:session.user.email
        }
      })


    const order = await prisma.order.findUnique({
        where:{
                id:orderId,
                studentId:user.id,
                paymentStatus:"PAID" 
        }
    });



    if(!order){
        return null;
    }

    return order
}


export async function getOrdersFromServer(){


    const session = await getServerSession(authOptions)

    const orders = await prisma.student.findUnique({
    where: {
    email: session.user.email,

  },
  select: {
    id: true,
    email: true,
    name: true,
    orders: 
    {
      where:{
        paymentStatus:"PAID"
      },
      select: {
        id: true,
        otpCode: true,
        createdAt: true,
        status:true,
        },
      orderBy: {
        createdAt: "desc", // latest first
      },
      
    },
  },
});



    if(!orders){
        return null;
    }

    return orders
}