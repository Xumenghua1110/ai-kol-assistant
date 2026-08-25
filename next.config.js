/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/outreach-hub',
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

module.exports = nextConfig;
