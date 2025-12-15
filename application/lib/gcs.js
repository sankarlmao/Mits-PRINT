import { Storage } from '@google-cloud/storage';

const serviceAccount = JSON.parse(
  process.env.GCP_SERVICE_ACCOUNT 
);

export const storage = new Storage({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
});

export const bucket = storage.bucket(
  process.env.GCS_BUCKET_NAME 
);
