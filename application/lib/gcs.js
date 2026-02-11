import { Storage } from "@google-cloud/storage";

let storage = null;
let bucket = null;

export function getGCSBucket() {
  // Already initialized → reuse
  if (bucket) return bucket;

  try {
    const raw = process.env.SERVICE_ACCOUNT_JSON;
    const bucketName = process.env.GCS_BUCKET_NAME;

    if (!raw || raw === "undefined") {
      console.warn("Missing SERVICE_ACCOUNT_JSON");
      return null;
    }

    if (!bucketName) {
      console.warn("Missing GCS_BUCKET_NAME");
      return null;
    }

    const serviceAccount = JSON.parse(raw);

    // Fix private key newlines
    if (serviceAccount.private_key) {
      serviceAccount.private_key =
        serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    storage = new Storage({
      credentials: serviceAccount,
      projectId: serviceAccount.project_id,
    });

    bucket = storage.bucket(bucketName);

    return bucket;
  } catch (err) {
    console.error("GCS init failed:", err);
    return null;
  }
}

