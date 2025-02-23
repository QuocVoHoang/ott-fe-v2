import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  images: {
    domains: ['upload.wikimedia.org'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
