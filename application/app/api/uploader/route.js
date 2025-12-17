import { NextResponse } from "next/server";
import { bucket } from "../../../lib/gcs";
import { randomUUID } from "crypto";


export  async function POST(req){

    const formData = await req.formData()

    const files = formData.getAll('files');

     if (!Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: "Invalid files" }, { status: 400 });
  }

  const uploads = await Promise.all(
    files.map(async ({ name, type }) => {
      if (type !== "application/pdf") {
        throw new Error("Only PDF allowed");
      }

    const fileName = `pdfs/${randomUUID()}.pdf`;
     

      const file = bucket.file(fileName);

      const [uploadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 6 * 60 * 1000,
        contentType: type,
      });

      return {
        uploadUrl,
        fileUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      };
    })
  );
  return NextResponse.json({ uploads });
}



