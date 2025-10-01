/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io'],
  },
  transpilePackages: [
    '@wagmi/core',
    '@wagmi/chains',
    '@wagmi/connectors',
  ],//укажим пакеты для транспиляции
  outputFileTracingRoot: __dirname, // Добавляем эту строку. __dirname - текущая директория, корень проекта
};

module.exports = nextConfig;