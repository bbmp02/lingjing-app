const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://lingjing-app-api.vercel.app/:path*' }
    ]
  }
}
module.exports = nextConfig
