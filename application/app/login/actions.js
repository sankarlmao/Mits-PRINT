"use server";

import { NextResponse } from "next/server";
import {PrismaClient} from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
});


 const prisma = new PrismaClient({
    adapter:new PrismaPg(pool)
 });

export default async function handleLogin(formData){

   

    const email = formData.get('collegeMail');
    const password = formData.get('password');

    
    if(!email || !password){
         throw new Error("Invalid input");
    }


    const user = await prisma.student.findUnique({
        where:{email:email, password:password}
    })

    if(!user){
        throw new Error("Invalid credentails");
    }

    console.log(user);
}