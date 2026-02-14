/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  // Experimental features
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
