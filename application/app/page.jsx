
"use client"

import { signOut } from 'next-auth/react'
import React from 'react'

const Homepage = () => {

  const logout = async()=>{
          signOut({ callbackUrl: "/login" })
  }
  return (
    <div>
DASHBOARD


    <button  onClick={logout} className='bg-amber-400 cursor-pointer px-6 py-1 rounded-2xl'>Sign Out</button>
    </div>
  )
}

export default Homepage;