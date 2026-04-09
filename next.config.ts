const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://118.27.100.221/blog',
      },
      {
        source: '/blog/:path*',
        destination: 'https://118.27.100.221/blog/:path*',
      },
    ];
  },
};

export default nextConfig;
