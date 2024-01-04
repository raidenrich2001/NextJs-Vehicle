/** @type {import('next').NextConfig} */
const nextConfig = {images: {

        remotePatterns: [
            {
              protocol: "http",
              hostname: "172.16.0.100",
            },
          ],
  },}

module.exports = nextConfig
