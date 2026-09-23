import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const region = process.env.AWS_REGION || "ap-south-1";
const bucket = process.env.S3_BUCKET_NAME || "";

const s3 = new S3Client({ region });

/** Uploads a photo buffer to S3 and returns the object key to store on the OrderPhoto record. */
export async function uploadPhotoToS3(file: Express.Multer.File): Promise<string> {
  const ext = (file.originalname.split(".").pop() || "jpg").toLowerCase();
  const key = `order-photos/${Date.now()}-${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return key;
}

/**
 * Returns a time-limited signed URL for a stored photo key.
 * Falls back to returning the value unchanged if it isn't an S3 key
 * (e.g. legacy local "/uploads/..." paths from before the S3 migration).
 */
export async function getPhotoUrl(key: string): Promise<string> {
  if (key.startsWith("/uploads/") || key.startsWith("http")) {
    return key;
  }

  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
}

