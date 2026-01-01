import Image from "next/image";
import { ComponentProps } from "react";

interface UploadImageProps extends Omit<ComponentProps<typeof Image>, "src"> {
  src: string | null | undefined;
  alt: string;
}

/**
 * Image component specifically for uploaded images
 * Uses unoptimized mode to avoid Next.js image optimization issues
 * Supports both Supabase Storage URLs and local /uploads/ paths (for migration)
 */
export function UploadImage({ src, alt, ...props }: UploadImageProps) {
  if (!src) {
    return null;
  }

  // For uploaded images (Supabase URLs or local /uploads/ paths), use unoptimized
  // Images are already optimized by Sharp before upload
  const isUpload =
    src.startsWith("/uploads/") ||
    src.includes("supabase.co/storage") ||
    src.includes("supabase.in/storage");

  return <Image src={src} alt={alt} unoptimized={isUpload} {...props} />;
}
