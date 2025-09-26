/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io']
  },
  outputFileTracingRoot: __dirname, // Указываем корень проекта
   transpilePackages: ['@wagmi/core',
    '@wagmi/chains',
    '@wagmi/connectors'],//укажим пакеты для транспиляции
};

module.exports = nextConfig;