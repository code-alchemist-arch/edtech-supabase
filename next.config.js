/** @type {import('next').NextConfig} */
const hostnames = ['vod.api.video', 'images.ctfassets.net']
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: hostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
};

module.exports = nextConfig;
