import sharp from "sharp";
// import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";

/**
 * Uploads and optimizes an image to local server storage
 * @param file - The image file to upload
 * @param folder - The folder name in the public/uploads directory
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

  // Optimize image using sharp
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  // Ensure directory exists
  const publicDir = path.join(process.cwd(), "public");
  const uploadsDir = path.join(publicDir, "uploads");
  const targetDir = path.join(uploadsDir, folder);

  try {
    await mkdir(targetDir, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
    // Continue attempting to write - mkdir might fail if it exists (though recursive: true handles that usually)
  }

  // Write to local filesystem
  const filePath = path.join(targetDir, filename);
  await writeFile(filePath, optimizedBuffer);

  // Return public URL path
  return `/uploads/${folder}/${filename}`;
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
 * Deletes an image file from local server storage
 * @param imageUrl - The public URL of the image
 */
export async function deleteImageFile(
  imageUrl: string | null | undefined,
): Promise<void> {
  if (!imageUrl) return;

  try {
    // Check if it's a local upload
    if (imageUrl.startsWith("/uploads/")) {
      const publicDir = path.join(process.cwd(), "public");
      // Remove leading slash to join correctly
      const relativePath = imageUrl.substring(1);
      const fullPath = path.join(publicDir, relativePath);

      await unlink(fullPath);
      return;
    }

    // Legacy Supabase cleanup (optional, but good to keep if we are transitioning)
    // Commented out to avoid using Supabase client
    /*
    if (imageUrl.includes("supabase.co/storage")) {
       // ... existing supabase logic would go here if we wanted to keep it
    }
    */
  } catch (error) {
    // Log error but don't throw - we don't want to fail the operation if image deletion fails
    console.error(`Error deleting image: ${error}`);
  }
}
