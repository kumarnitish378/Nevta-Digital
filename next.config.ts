import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Standalone output is best for Firebase App Hosting
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
