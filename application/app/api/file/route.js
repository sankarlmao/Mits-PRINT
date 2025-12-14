import { NextResponse } from "next/server";


export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const SECRET_KEY = searchParams.get("SECRET_KEY");

  if (SECRET_KEY!=process.env.SECRET_KEY)
    return NextResponse.json({error:"you are not auth to get this "})

  return NextResponse.json({message:"You can get the orders from me "})
}