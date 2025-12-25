import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
