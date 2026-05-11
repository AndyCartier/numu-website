/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // drei pulls in loaders not shipped with the package — stub them
      './loaders/AssimpLoader.js': false,
    }
    return config
  },
}

export default nextConfig
