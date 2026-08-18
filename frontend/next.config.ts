import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
{
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // Note: Using '**' allows all domains, but it's safer to specify exact domains like 'raw.githubusercontent.com'
      },
        ],

    },
    
};

export default nextConfig;
