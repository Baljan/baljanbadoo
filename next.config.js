/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const prefix = isProd ? "" : "";

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: prefix,
  publicRuntimeConfig: {
    basePath: prefix,
  },
  basePath: prefix,
};

module.exports = nextConfig;
