const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'http://118.27.100.221/blog',
      },
      {
        source: '/blog/:path*',
        destination: 'http://118.27.100.221/blog/:path*',
      },
    ];
  },
};

export default nextConfig;
