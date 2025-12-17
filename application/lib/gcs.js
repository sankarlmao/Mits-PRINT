import { Storage } from '@google-cloud/storage';

const serviceAccount = JSON.parse(
  process.env.SERVICE_ACCOUNT_JSON
);

serviceAccount.private_key =
  serviceAccount.private_key.replace(/\\n/g, "\n");



export const storage = new Storage({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
});

export const bucket = storage.bucket(
  process.env.GCS_BUCKET_NAME 
);
