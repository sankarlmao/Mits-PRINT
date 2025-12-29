
import { prisma } from "../lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";



export async function updatePrinterStatus(data) {

    const {printerId , printerStatus , printerReason} =data;

    const p = await prisma.printer.update({
        where:{id :printerId},
        data:{
            status:printerStatus,
            reason:printerReason
        }
    });

    return true
}