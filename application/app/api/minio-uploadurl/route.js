import { NextResponse } from "next/server";
import { minioClient } from "../../../lib/minio";

export async function POST(req) {
  let fileMetaData;

  try {
    fileMetaData = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!Array.isArray(fileMetaData) || fileMetaData.length === 0) {
    return NextResponse.json(
      { error: "Invalid files array" },
      { status: 400 }
    );
  }

  for (const file of fileMetaData) {
    if (!file.id || !file.type) {
      return NextResponse.json(
        { error: "Missing id or type" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF allowed" },
        { status: 400 }
      );
    }
  }

  console.log(fileMetaData + "froms erver")
  const uploads = await Promise.all(
    fileMetaData.map(async ({ id, type }) => {
      const objectName = `pdfs/${id}.pdf`;

      const uploadUrl = await minioClient.presignedPutObject(
        process.env.BUCKET_NAME,
        objectName,
        60 * 6 // 6 minutes
      );
      const downloadUrl = await minioClient.presignedGetObject(
        process.env.BUCKET_NAME,
        objectName,
        60 * 15 //15 minutes
        );

      return {
        id,
        uploadUrl,
        fileUrl:downloadUrl
      };
    })
  );

  return NextResponse.json({ uploads });
}
