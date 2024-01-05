/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "**",
        protocol: "http",
        port: "3000",
      },
      {
        hostname: "marketplace-production-bc49.up.railway.app",
        protocol: "https",
      },
      {
        hostname: "marketplace-app-gbrd.onrender.com",
        protocol: "https",
      }
    ],
  },
}

module.exports = nextConfig
