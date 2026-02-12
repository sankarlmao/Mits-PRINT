import { minioClient } from "./minio";

function parseMinioPublicUrl(fileUrl) {
  try {
    const url = new URL(fileUrl);

    // pathname example:
    // /mits-print-bucket/pdfs/uuid.pdf
    const [, bucket, ...pathParts] = url.pathname.split("/");

    return {
      bucket,
      objectName: pathParts.join("/"),
    };
  } catch {
    return null;
  }
}

export async function deleteFromMinio(
  fileUrls
) {
  if (!process.env.BUCKET_NAME) {
    console.error("MinIO not configured");
    return { success: false };
  }

  await Promise.allSettled(
    fileUrls.map(async ({ fileUrl }) => {
      if (!fileUrl) return;

      try {
        const parsed = parseMinioPublicUrl(fileUrl);
        if (!parsed) return;

        const { objectName } = parsed;

        await minioClient.removeObject(
          process.env.BUCKET_NAME,
          objectName
        );
      } catch (err) {
        console.error("Failed to delete:", fileUrl, err);
      }
    })
  );

  return { success: true };
}

export async function deleteSingleFileFromMinio(
  fileUrl
) {
  if (!process.env.BUCKET_NAME) {
    console.error("MinIO not configured");
    return;
  }

  try {
    const parsed = parseMinioPublicUrl(fileUrl);
    if (!parsed) return;

    const { objectName } = parsed;

    await minioClient.removeObject(
      process.env.BUCKET_NAME,
      objectName
    );
  } catch (err) {
    console.error("Failed to delete:", fileUrl, err);
  }
}
