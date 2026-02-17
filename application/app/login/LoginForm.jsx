"use client"
import DotLoader from "../../components/DotLoader"
import { signIn } from "next-auth/react"
import Image from "next/image"
import React, { useState } from "react"

const Login = () => {
  const [error, setError] = useState(null)
    const [load, setLoad] = useState(false)
  
    async function handleSubmit(e) {
      e.preventDefault()
      setLoad(true)
  
     
      const form = e.currentTarget
      console.log(form)
      const res = await signIn("credentials", {
        email: form.email.value,
        password: form.password.value,
        redirect: false,
        callbackUrl: "/",
      })
  
      if (res?.error) {
        setError("Invalid credentials entered")
        setLoad(false)
      } else {
        setLoad(false)
        window.location.href = res?.url ?? "/"
      }
    }

  return (
<section className="w-full h-screen relative overflow-hidden bg-[#eceaf1] flex flex-col">
      {/* soft grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* pastel blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[140px]" />
      <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-yellow-200/30 rounded-full blur-[140px]" />

{/* Brand Header */}
<div className="w-full flex flex-col items-center gap-3 py-8 absolute min-md:top-14">

  {/* Brand row */}
  <div className="flex items-center gap-4">

    {/* Red M logo */}
    {/* <div className="w-[50px] h-[50px] rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-2xl"> */}
      <Image
      src="/mitsprint.png"
      alt="M"
      width={50}
      height={50}
      className="opacity-100 rounded-2xl"
    />
    {/* </div> */}

    {/* Brand name */}
     <h1 className="text-2xl font-bold tracking-tight text-primary-black">
            MITS <span className="text-accent-red font-black">PRINT</span>
      </h1>

    {/* Divider */}
    <div className="w-[1px] h-10 bg-gray-400/40" />

    {/* College logo */}
    <Image
      src="/college_logo.png"
      alt="College Logo"
      width={150}
      height={50}
      className="opacity-90 rounded-xl"
    />
  </div>

  {/* Tagline */}
  <p className="text-sm text-gray-800 font-rubik tracking-wide text-center">
    Smart way to print lab outputs &amp; project reports
  </p>

</div>




     

      {/* Login card */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">        
        <div className="bg-white/70 backdrop-blur-2xl border border-black/5 rounded-3xl shadow-xl px-12 py-14 w-[420px] max-w-[90%]">

                <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
                  Welcome 
                </h2>

                <p className="text-gray-500 text-sm text-center mb-8">
                  Sign in to continue to MITS Print
                </p>

              <div className="space-y-5">
                <form
                onSubmit={handleSubmit}>
                  {/* Email */}
                  <div>
                    <label className="text-sm text-gray-600">College Email</label>
                    <div className="mt-1 flex items-center bg-white/60 backdrop-blur-md border border-black/10 rounded-xl">
                      <input
                        name="email"
                        required
                        type="email"
                        placeholder="admno@mgits.ac.in"
                        className="w-full py-3 bg-transparent outline-none text-gray-900 placeholder-gray-400 rounded-xl px-4"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <div className="mt-1 flex items-center bg-white/60 backdrop-blur-md border border-black/10 rounded-xl ">
                      <input
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full py-3 bg-transparent outline-none text-gray-900 placeholder-gray-400 px-4 rounded-xl"
                      />
                    </div>
                  </div>
                    {/* Error */}
                  <p className="text-red-500 text-sm h-[40px] py-3 px-3">
                    {error}
                  </p>

                  <button
                  type="submit"
                  className="w-full py-3 h-[50px] bg-black text-white rounded-xl font-medium hover:bg-green-600 transition flex justify-center items-center cursor-pointer">
                  {load ? <DotLoader/> : "Login"}
                </button>
                </form>



                </div>
              </div>
            </div>

          </section>
  )
}

export default Login
