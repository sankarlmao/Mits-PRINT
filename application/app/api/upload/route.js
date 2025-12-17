import { bucket } from '../../../lib/gcs';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createOrder } from '../../../services/orders.service';

export async function POST(req) {
  const formData = await req.formData();

const items = formData
  .getAll("metadata")
  .map(item => JSON.parse(item));


   await createOrder(items)


  return NextResponse.json({
    success:true,
    message:"Files sent to mits store PC "
  });
}
