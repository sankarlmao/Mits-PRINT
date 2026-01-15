import { Storage } from "@google-cloud/storage";
import { storage } from "./gcs";

function parseGcsPublicUrl(fileUrl) {
  const url = new URL(fileUrl);

  const [, bucket, ...pathParts] = url.pathname.split("/");

  return {
    bucket,
    filePath: pathParts.join("/"),
  };
}







export async function deleteFromGcs(fileUrls) {

 await Promise.allSettled(
  fileUrls.map(async ({ fileUrl }) => {
    if (!fileUrl) return;

    try {
      const { bucket, filePath } = parseGcsPublicUrl(fileUrl);
      await storage.bucket(bucket).file(filePath).delete();
    } catch (err) {
      console.error("Failed to delete:", fileUrl, err);
    }
  })
);

  return { success: true };
}


export async function deleteSingleFileFromGCS(fileUrl) {

  try{
    const {bucket,filePath} =parseGcsPublicUrl(fileUrl);
    await storage.bucket(bucket).file(filePath).delete();
  }
  catch(err){
    console.log("Failed to delete:",fileUrl,err)
  }
  
}