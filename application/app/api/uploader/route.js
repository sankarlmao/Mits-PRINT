import { NextResponse } from "next/server";
import { getGCSBucket } from "../../../lib/gcs";

export async function POST(req) {


    const bucket = getGCSBucket();

    if (!bucket) {
      throw new Error("GCS not configured");
    }
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

  const uploads = await Promise.all(
    fileMetaData.map(async ({ id, type }) => {
      const fileName = `pdfs/${id}.pdf`;
      const file = bucket.file(fileName);

      const [uploadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 6 * 60 * 1000,
        contentType: type,
      });

      return {
        id,
        uploadUrl,
        fileUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      };
    })
  );

  return NextResponse.json({ uploads });
}
