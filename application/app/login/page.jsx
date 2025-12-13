import Image from 'next/image';
import React from 'react'

const LoginPage = () => {
  return (
    <section className='bg-200 bg-white-600 h-screen w-full flex flex-col items-center justify-center min-lg:flex-row'>
        

        <div className='bg-[#f4312a] w-full h-[30%] min-lg:w-[40%] min-md:h-full flex  flex-col justify-center items-center gap-5  '>
        
        <Image src={'/college_logo.png'} alt='College Logo ' height={100} width={400} className='rounded-xl' quality={100}/>
        <h1 className=' font-bold text-white text-4xl text-center font-changa min-lg:text-7xl'>MITS PRINT </h1>

    <p className='text-secondary-color text-lg text-center font-bold font-'>Smart approach for printing lab outputs and project reports without crowding.</p>
        </div>


        <div className='w-full flex justify-center items-center h-[70%] min-lg:w-[60%] min-lg:h-full'>


        <div className='w-[90%] max-w-[500px] h-[350px] bg-secondary-color shadow-gray-400 shadow-lg rounded-2xl pt-6'>

        

            {/* EMAIL */}
            <div className='w-full h-[80px] flex flex-col px-6 gap-3 mb-6' >
            <span className='text-text-primary-color font-semibold  text-xl'>College mail ID :</span>
            <input type="text" className='border-1 border-gray-400 h-[50px] p-2 text-xl rounded-lg outline-0 focus:border-green-500' placeholder='student email' />
            </div>

                {       /* PASSWORD */}
               <div className='w-full h-[80px] flex flex-col px-6 gap-3 mb-5'>
            <span className='text-text-primary-color font-semibold text-xl'>Password :</span>
            <input type="text" className='border-1 border-gray-400 h-[50px] p-2 text-xl rounded-lg outline-0 focus:border-green-500' placeholder='password' />
            </div>


            <div className='flex items-center justify-center w-full px-6 '>
                <button className='bg-green-600 text-white h-[50px] w-full cursor-pointer rounded-xl text-xl  font-semibold hover:bg-green-500 hover:text-text-primary-color transition-all delay-75'>Login</button>
            </div>

            
        </div>
        </div>
    </section>
  )
}

export default LoginPage;