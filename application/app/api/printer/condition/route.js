import { getPrinterStatus } from "../../../../services/printer.service";
import { NextResponse } from "next/server";


export async function GET(req){

    const {searchParams }= new URL(req.url);

    const printerType = searchParams.get('type')

    const printer = await getPrinterStatus(printerType);

    return NextResponse.json({success:true, printer})
    
}