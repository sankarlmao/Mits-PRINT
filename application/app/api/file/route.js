import { NextResponse } from "next/server";


export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const SECRET_KEY = searchParams.get("SECRET_KEY");

  if (SECRET_KEY!=process.env.SECRET_KEY)
    return NextResponse.json({error:"you are not auth to get this "})

  return NextResponse.json({
  "orders": [
    {
      "id": "ckxq1m9f20001abc123xyz",
      "otpCode": "482913",
      "student": {
        "id": "ckxq1m1aa0001stu123",
        "name": "Rahul Sharma",
        "email": "rahul.sharma@example.com"
      },
      "createdAt": "2025-09-12T10:15:30.000Z",

      "payment": {
        "id": "ckxq1pmt0001pay123",
        "amount": 2500,
        "currency": "INR",
        "status": "PRINTING",
        "razorpayOrderId": "order_Lp8xyz123",
        "createdAt": "2025-09-12T10:14:50.000Z"
      },

      "prints": [
        {
          "id": "ckxq1prn0001print1",
          "fileUrl": "https://storage.example.com/files/notes.pdf",
          "copies": 2,
          "colorMode": "BLACK_WHITE",
          "orientation": "PORTRAIT",
          "printOnBothSides": true,
          "pageRange": "ALL",
          "customRange": null,
          "status": "PENDING",
          "createdAt": "2025-09-12T10:15:30.000Z"
        },
        {
          "id": "ckxq1prn0002print2",
          "fileUrl": "https://storage.example.com/files/assignment.pdf",
          "copies": 1,
          "colorMode": "COLOR",
          "orientation": "LANDSCAPE",
          "printOnBothSides": false,
          "pageRange": "CUSTOM",
          "customRange": "1-5,8",
          "status": "SUCCESS",
          "createdAt": "2025-09-12T10:16:10.000Z"
        }
      ]
    },

    {
      "id": "ckxq2m9f20002abc456xyz",
      "otpCode": "739204",
      "student": {
        "id": "ckxq2m1aa0002stu456",
        "name": "Ananya Verma",
        "email": "ananya.verma@example.com"
      },
      "createdAt": "2025-09-12T11:05:12.000Z",

      "payment": {
        "id": "ckxq2pmt0002pay456",
        "amount": 1200,
        "currency": "INR",
        "status": "PRINTED",
        "razorpayOrderId": "order_Lp8abc789",
        "createdAt": "2025-09-12T11:04:40.000Z"
      },

      "prints": [
        {
          "id": "ckxq2prn0001print3",
          "fileUrl": "https://storage.example.com/files/project.pdf",
          "copies": 3,
          "colorMode": "BLACK_WHITE",
          "orientation": "PORTRAIT",
          "printOnBothSides": true,
          "pageRange": "EVEN",
          "customRange": null,
          "status": "SUCCESS",
          "createdAt": "2025-09-12T11:05:12.000Z"
        }
      ]
    }
  ]
}
)
}