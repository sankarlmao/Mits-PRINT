
"use client"
import {signIn} from "next-auth/react"
import { redirect } from 'next/navigation';
import Image from 'next/image'
import React, { useState } from 'react'
import DotLoader from "../../components/DotLoader";

const LoginForm = () => {


    
    const [error, setError] = useState();
    const [load, setLoad] = useState(false);
    async function handleSubmit(e) {
    setLoad(true)
    e.preventDefault();

    const form = e.currentTarget;
    const res = await signIn("credentials", {
      email: form.email.value,
      password: form.password.value,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentails entered")
      setLoad(false);
    } else {
        setLoad(false)
      redirect('/')
    }
  }



  return (
    <section className='bg-200 bg-white-600 h-screen w-full flex flex-col items-center justify-center min-lg:flex-row'>
        

        <div className='bg-[#f4312a] w-full h-[30%] min-lg:w-[40%] min-md:h-full flex  flex-col justify-center items-center gap-5  '>
        
        <Image src={'/college_logo.png'} alt='College Logo ' height={100} width={400} className='rounded-xl' quality={100}/>
        <h1 className=' font-bold text-white text-4xl text-center font-changa min-lg:text-7xl'>MITS PRINT </h1>

    <p className=' px-2 text-secondary-color text-lg text-center font-bold font-'>Smart approach for printing lab outputs and project reports without crowding.</p>
        </div>


        <div className='w-full flex justify-center items-center h-[70%] min-lg:w-[60%] min-lg:h-full'>


        <form onSubmit={handleSubmit} className='w-[90%] max-w-[600px] h-[380px] bg-secondary-color shadow-gray-400 shadow-lg rounded-2xl py-6 flex flex-col '>

            
            <span className='text-2xl text-center w-full text-foreground font-semibold text-3xl'> Login</span>
            {/* EMAIL */}
            <div className='w-full h-[80px] flex flex-col px-6 gap-3 mb-6' >
            <label className='text-text-primary-color font-semibold  text-xl'>College mail ID :</label>
            <input type="email" className='border-1 border-gray-400 h-[50px] p-2 text-lg rounded-lg outline-0 focus:border-2 focus:border-green-500' placeholder='student email'   required autoComplete='college-email' name='email'/>
            </div>

                {       /* PASSWORD */}
               <div className='w-full h-[80px] flex flex-col px-6 gap-3 mb-5'>
            <label className='text-text-primary-color font-semibold text-xl'>Password :</label>
            <input type="password" className='border-1 border-gray-400 h-[50px] p-2 text-lg rounded-lg outline-0 focus:border-2 font focus:border-green-500' placeholder='password'  required name='password' autoComplete='current-password'/>
            </div>


                <p className="py-1 px-8 text-red-500 font-medium text-left h-[30px]">{"  "} {error}</p>
        
            <div className='flex items-center justify-center w-full px-6 '>
                <button type='submit' className='bg-green-600 text-white h-[50px] w-full cursor-pointer rounded-xl text-xl -semibold hover:bg-green-500  transition-all delay-75 flex justify-center items-center' > {load? <DotLoader/> :"Login"}</button>
            </div>

            
        </form>
        </div>
    </section>
  )
  
}

export default LoginForm