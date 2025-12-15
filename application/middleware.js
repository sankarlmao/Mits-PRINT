import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 🔓 Public routes (VERY IMPORTANT)
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/api/file" 

  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // if (!token) {
  //   const loginUrl = new URL("/login", req.url);
  //   loginUrl.searchParams.set("callbackUrl", req.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}     

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
