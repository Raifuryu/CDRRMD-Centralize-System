/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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