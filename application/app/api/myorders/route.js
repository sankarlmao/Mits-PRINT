import { NextResponse } from "next/server";
import { getMyOrder, getMyOrders } from "../../../services/customer.service";

export async function GET(req) {
    
    const {searchParams }= new URL(req.url);

    const orderId =searchParams.get('order_id');

    if(orderId){

        const myOrder = await getMyOrder(orderId)

        console.log(myOrder)
        if(!myOrder){
            return NextResponse.json({success:false})
        }

        return NextResponse.json({success:true, data:myOrder})

    }

    return NextResponse.json({success:false})
    
}