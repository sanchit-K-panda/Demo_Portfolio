/**
 * Optional Cloudinary image loader.
 * Activated when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set.
 * Otherwise, Next.js uses its built-in loader.
 */
interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return src; // fallback to original URL

  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality ?? "auto"}`];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}/${src}`;
}
