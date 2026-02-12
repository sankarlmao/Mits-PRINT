import { getGCSBucket } from "./gcs";

function parseGcsPublicUrl(fileUrl) {
  try {
    const url = new URL(fileUrl);

    const [, bucket, ...pathParts] = url.pathname.split("/");

    return {
      bucket,
      filePath: pathParts.join("/"),
    };
  } catch {
    return null;
  }
}

export async function deleteFromGcs(fileUrls) {
  const defaultBucket = getGCSBucket();

  if (!defaultBucket) {
    console.error("GCS not configured");
    return { success: false };
  }

  await Promise.allSettled(
    fileUrls.map(async ({ fileUrl }) => {
      if (!fileUrl) return;

      try {
        const parsed = parseGcsPublicUrl(fileUrl);

        if (!parsed) return;

        const { filePath } = parsed;

        await defaultBucket.file(filePath).delete();
      } catch (err) {
        console.error("Failed to delete:", fileUrl, err);
      }
    })
  );

  return { success: true };
}

export async function deleteSingleFileFromGCS(fileUrl) {
  const bucket = getGCSBucket();

  if (!bucket) {
    console.error("GCS not configured");
    return;
  }

  try {
    const parsed = parseGcsPublicUrl(fileUrl);

    if (!parsed) return;

    const { filePath } = parsed;

    await bucket.file(filePath).delete();
  } catch (err) {
    console.error("Failed to delete:", fileUrl, err);
  }
}
