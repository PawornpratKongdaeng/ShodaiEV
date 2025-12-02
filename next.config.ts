import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shodaiev.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shodaiev.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kuqizsvhpesa44qy.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      // 👇 อันใหม่สำหรับ Cloudflare R2
      {
        protocol: "https",
        hostname: "pub-e7440998ddc246219a43cd789dde7102.r2.dev",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/th",
        destination: "/",
        permanent: true,
      },
      {
        source: "/th/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
