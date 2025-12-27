import sharp from "sharp";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function uploadAndOptimizeImage(
  file: File,
  folder: string = "general"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create directory if it doesn't exist
  const folderPath = join(UPLOAD_DIR, folder);
  await mkdir(folderPath, { recursive: true });

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

  // Save optimized image
  const filepath = join(folderPath, filename);
  await writeFile(filepath, optimizedBuffer);

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
 * Deletes an image file from the public/uploads directory
 * @param imagePath - The public URL path (e.g., "/uploads/thumbnails/filename.webp")
 */
export async function deleteImageFile(imagePath: string | null | undefined): Promise<void> {
  if (!imagePath) return;

  try {
    // Remove leading slash and convert to file system path
    const filePath = join(process.cwd(), "public", imagePath.startsWith("/") ? imagePath.slice(1) : imagePath);
    
    // Check if file exists before attempting to delete
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    // Log error but don't throw - we don't want to fail the operation if image deletion fails
    console.error(`Failed to delete image file: ${imagePath}`, error);
  }
}
