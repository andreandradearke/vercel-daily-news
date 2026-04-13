import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/29491832/pexels-photo-29491832.jpeg',
      },
    ],
  },
};

export default nextConfig;
