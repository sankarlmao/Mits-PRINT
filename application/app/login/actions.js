"use server";

import { error } from "node:console";
import { findUserByEmailAndPassword } from "../../lib/services/auth";




export default async function handleLogin(formData){

   

    const email = formData.get('collegeMail');
    const password = formData.get('password');

    
    if(!email || !password){
        return {error:"Invalid inputs"}
    }


    const user =  await findUserByEmailAndPassword(email,password)

    if(!user){
        return {error:"Invalid credentials "}
    }

    console.log(user);
}