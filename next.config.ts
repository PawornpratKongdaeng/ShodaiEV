/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... config อื่น ๆ ของโปรเจกต์

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
