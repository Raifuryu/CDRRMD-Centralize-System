/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "github.com",
      },
    ],
  },
};

export default nextConfig;
