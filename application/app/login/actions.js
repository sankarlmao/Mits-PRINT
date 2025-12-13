"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "../generated/prisma/client";

 const prisma = new PrismaClient();

export default async function handleLogin(formData){

   

    const email = formData.get('collegeMail');
    const password = formData.get('password');

    
    if(!email || !password){
         throw new Error("Invalid input");
    }


    const user = await prisma.student.findUnique({
        where:{email:email}
    })

    if(!user){
        throw new Error("Invalid credentails");
    }

    console.log(user);
}