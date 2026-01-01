import sharp from "sharp";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";

/**
 * Uploads and optimizes an image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder name in the storage bucket (e.g., "thumbnails", "teachers")
 * @returns The public URL of the uploaded image
 */
export async function uploadAndOptimizeImage(
  file: File,
  folder: string = "general"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const filename = `${timestamp}-${randomStr}.webp`;

  // Optimize image using sharp
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  // Upload to Supabase Storage
  const filePath = `${folder}/${filename}`;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, optimizedBuffer, {
      contentType: "image/webp",
      upsert: false, // Don't overwrite existing files
    });

  if (error) {
    if (
      error.message.includes("Bucket not found") ||
      error.message.includes("not found")
    ) {
      throw new Error(
        `Bucket "${STORAGE_BUCKET}" not found in Supabase Storage.\n\n` +
          `To fix this:\n` +
          `1. Go to your Supabase Dashboard: https://app.supabase.com\n` +
          `2. Select your project\n` +
          `3. Go to "Storage" in the left sidebar\n` +
          `4. Click "New bucket"\n` +
          `5. Name it: "${STORAGE_BUCKET}"\n` +
          `6. ✅ Enable "Public bucket"\n` +
          `7. Set allowed MIME types: image/jpeg, image/png, image/webp, image/gif\n` +
          `8. Click "Create bucket"\n\n` +
          `Or check your existing buckets by visiting: http://localhost:3000/api/check-bucket\n` +
          `If you have a bucket with a different name, update SUPABASE_STORAGE_BUCKET in your .env.local file.`
      );
    }
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return publicUrl;
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
 * Deletes an image file from Supabase Storage
 * @param imageUrl - The public URL of the image (Supabase Storage URL)
 */
export async function deleteImageFile(
  imageUrl: string | null | undefined
): Promise<void> {
  if (!imageUrl) return;

  try {
    // Extract file path from Supabase Storage URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.indexOf("public");

    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      // Invalid URL format or old local path format
      console.warn(`Invalid image URL format: ${imageUrl}`);
      return;
    }

    // Extract the file path after the bucket name
    const filePath = pathParts.slice(bucketIndex + 2).join("/");

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error(`Failed to delete image from Supabase: ${error.message}`);
      // Don't throw - we don't want to fail the operation if image deletion fails
    }
  } catch (error) {
    // Log error but don't throw - we don't want to fail the operation if image deletion fails
    console.error(`Error deleting image: ${error}`);
  }
}
