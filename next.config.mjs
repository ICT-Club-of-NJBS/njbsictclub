/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Properly type check on build
    tsconfigPath: './tsconfig.json',
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },
  // Enable React strict mode for development
  reactStrictMode: true,
  // Add compression for production
  compress: true,
}

export default nextConfig
