import sharp from "sharp";
import { minioClient, MINIO_BUCKET, ensureBucketExists } from "@/lib/minio";
import { v4 as uuidv4 } from "uuid"; // We might need to install uuid or just use random string

/**
 * Uploads and optimizes an image to MinIO storage
 * @param file - The image file to upload
 * @param folder - The folder name (prefix) in the bucket
 * @returns The public URL of the uploaded image
 */
export async function uploadAndOptimizeImage(
  file: File,
  folder: string = "general",
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const filename = `${timestamp}-${randomStr}.webp`;
  const objectName = `${folder}/${filename}`;

  // Optimize image using sharp
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  // Ensure bucket exists (lazy check)
  await ensureBucketExists();

  // Upload to MinIO
  await minioClient.putObject(
    MINIO_BUCKET,
    objectName,
    optimizedBuffer,
    optimizedBuffer.length,
    {
      "Content-Type": "image/webp",
    }
  );

  // Construct public URL
  // If MINIO_ENDPOINT is set, use it. Otherwise construct from client config.
  // Note: For local development with Docker/MinIO, the browser needs to be able to access this URL.
  // If running in Docker compose, localhost:9000 often works for browser.

  // Construct public URL
  // We can construct the URL from the environment variables or the client config we know we set
  const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
  const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";

  // If endpoint is a full URL, use it
  let baseUrl = endpoint;
  if (!baseUrl.startsWith("http")) {
    baseUrl = `${protocol}://${endpoint}`;
  }

  // Remove trailing slash
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const contentUrl = `${baseUrl}/${MINIO_BUCKET}/${objectName}`;

  return contentUrl;
}

export async function uploadThumbnail(file: File): Promise<string> {
  return uploadAndOptimizeImage(file, "thumbnails");
}

export async function uploadRoutineImage(file: File): Promise<string> {
  return uploadAndOptimizeImage(file, "routines");
}

export async function uploadTeacherImage(file: File): Promise<string> {
  return uploadAndOptimizeImage(file, "teachers");
}

/**
 * Deletes an image file from MinIO storage
 * @param imageUrl - The public URL of the image
 */
export async function deleteImageFile(
  imageUrl: string | null | undefined,
): Promise<void> {
  if (!imageUrl) return;

  try {
    // Check if it's a MinIO URL (contains bucket name)
    // or just try to parse the object name from the URL
    if (imageUrl.includes(`/${MINIO_BUCKET}/`)) {
      const parts = imageUrl.split(`/${MINIO_BUCKET}/`);
      if (parts.length > 1) {
        const objectName = parts[1];
        await minioClient.removeObject(MINIO_BUCKET, objectName);
        return;
      }
    }

    // Handle legacy local uploads
    if (imageUrl.startsWith("/uploads/")) {
      // logic for deleting local file if needed, but maybe we can ignore or keep legacy support
      // For now, let's just log or ignore
      console.log("Skipping deletion of legacy local file:", imageUrl);
    }

  } catch (error) {
    // Log error but don't throw - we don't want to fail the operation if image deletion fails
    console.error(`Error deleting image: ${error}`);
  }
}
