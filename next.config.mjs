/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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

// module.exports = {
//   output: "standalone",
//   images: {
//     remotePatterns: [
//       {
//         hostname: "github.com",
//       },
//     ],
//   },
// };
