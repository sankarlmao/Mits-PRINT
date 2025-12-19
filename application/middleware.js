import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

 
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/college_logo.png" ||
    pathname === "/api/file" 

    

  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

if (!token) {
  return NextResponse.redirect(new URL("/login", req.url));
}


  return NextResponse.next();
}     

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
