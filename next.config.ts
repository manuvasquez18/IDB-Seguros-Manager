
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https' ,
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https' ,
        hostname: 'citas.previmedicaidb.com',
      },
      {
        protocol: 'https' ,
        hostname: 'citasprevimedicaidb.com',
      },
      {
        protocol: 'https',
        hostname: 'idbclinicas.com',
      }
    ],
  },
};

export default nextConfig;
