
export const R2_CONFIG = {
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET_NAME || "clopshort-shorts"
};

export const uploadToR2 = async (fileData: any, fileName: string) => {
  console.log(`[R2] Uploading ${fileName} to ${R2_CONFIG.endpoint}...`);
  // Note: Implémentation réelle via @aws-sdk/client-s3 pour R2
  return `${R2_CONFIG.endpoint}/${R2_CONFIG.bucket}/${fileName}`;
};
