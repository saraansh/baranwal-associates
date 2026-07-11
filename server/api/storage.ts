import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Object storage over the S3 protocol. In production this is Cloudflare R2;
 * locally it's the Supabase storage S3 endpoint — same client, same code.
 */
let client: S3Client | undefined;

function s3(): S3Client {
  client ??= new S3Client({
    region: process.env.R2_REGION ?? "auto",
    endpoint:
      process.env.R2_ENDPOINT ??
      (process.env.R2_ACCOUNT_ID
        ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
        : "http://127.0.0.1:54321/storage/v1/s3"),
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    },
  });
  return client;
}

const BUCKET = () => process.env.R2_BUCKET ?? "baranwal-associates";

export async function presignUpload(
  key: string,
  contentType: string,
  expiresIn = 600,
) {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn },
  );
}

export async function presignDownload(
  key: string,
  filename?: string,
  expiresIn = 600,
) {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      ...(filename
        ? {
            ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
          }
        : {}),
    }),
    { expiresIn },
  );
}
