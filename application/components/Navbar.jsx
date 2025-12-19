"use client";
import { RiLogoutCircleLine } from "react-icons/ri";
import { navItems } from "../constants/navItem";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CiMenuBurger } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
const Navbar = () => {
  const { data: session, status } = useSession();
  
  return (
    <div className="w-full bg-white h-[90px]  px-3 shadow-sm shadow-[#a8a8a8] min-lg:px-[200px] fixed top-0  flex flex-col justify-center">

    <div className="flex justify-between items-center">







      <span className="text-primary-color font-sans text-xl font-bold flex gap-2 justify-center items-center ">
     MITS PRINT
      </span>

    

       


      {status === "loading" ? null : session?.user ? (
        <div className="flex gap-3 items-center">
          <div className="flex flex-col items-end">
            <p className="font-semibold">
              {session.user.name ?? "User"}
            </p>
            <p className="text-sm font-light">
              {session.user.email}
            </p>
          </div>
        </div>
      ) : null}



    </div>


    <div className="w-full  h-[30px] flex justify-between items-center">

      <ul className="flex gap-3">

        {navItems.map(({label,url,icon:Icon})=>(

          <li key={label} >
            <Link href={url} className="flex gap-1 justify-center items-center text-gray-800 font-semibold">
            <Icon size={23} className="text-green-500"/>
            {label}
            </Link>
          </li>
        )
        )}



      </ul>

      <button onClick={()=>signOut()} className="flex justify-center items-center gap-1 cursor-pointer  rounded-2xl text-gray-700">
       <RiLogoutCircleLine className="text-red-400" /> Logout
      </button>



    </div>
    </div>
  );
};

export default Navbar;
