/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    loader: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "custom" : "default",
    loaderFile: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? "./lib/cloudinaryLoader.ts"
      : undefined,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    formats: ["image/avif", "image/webp"],
    // Allow local SVGs to be served through the Next.js image pipeline
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Transpile Three.js and Lenis for Next.js compatibility
  transpilePackages: ["three", "@studio-freight/lenis"],

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
