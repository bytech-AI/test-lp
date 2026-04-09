import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "http://wp.ai-hack-portal.com/blog",
      },
      {
        source: "/blog/:path*",
        destination: "http://wp.ai-hack-portal.com/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
