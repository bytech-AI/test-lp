const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://wp.ai-hack-portal.com/blog',
      },
      {
        source: '/blog/:path*',
        destination: 'https://wp.ai-hack-portal.com/blog/:path*',
      },
    ];
  },
};

export default nextConfig;
