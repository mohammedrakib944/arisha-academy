import Image from "next/image";
import { ComponentProps } from "react";

interface UploadImageProps extends Omit<ComponentProps<typeof Image>, "src"> {
  src: string | null | undefined;
  alt: string;
}

/**
 * Image component specifically for uploaded images
 * Uses unoptimized mode to avoid Next.js image optimization issues with local uploads
 */
export function UploadImage({ src, alt, ...props }: UploadImageProps) {
  if (!src) {
    return null;
  }

  // For uploaded images (starting with /uploads/), use unoptimized
  // For other images, use normal optimization
  const isUpload = src.startsWith("/uploads/");

  return <Image src={src} alt={alt} unoptimized={isUpload} {...props} />;
}
