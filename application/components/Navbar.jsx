"use client";

import { useSession } from "next-auth/react";
import { CiMenuBurger } from "react-icons/ci";

const Navbar = () => {
  const { data: session, status } = useSession();
  
  return (
    <div className="w-full bg-white h-[70px] flex justify-between items-center px-3 shadow-sm shadow-[#a8a8a8] min-lg:px-[200px]">

      <span className="text-primary-color font-sans text-xl font-bold">
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
  );
};

export default Navbar;
