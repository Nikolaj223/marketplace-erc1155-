// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['ipfs.io'],
//   },
//   transpilePackages: [
//     '@wagmi/core',
//     '@wagmi/chains',
//     '@wagmi/connectors',
//     '@metamask/sdk',
//     '@walletconnect/ethereum-provider',
//   ],
//   outputFileTracingRoot: __dirname,
//   webpack: (config) => {
//     config.externals = {
//       'pino-pretty': 'commonjs pino-pretty', // Указываем, что модуль обрабатывается как commonjs
//       'lokijs': 'commonjs lokijs', // Указываем, что модуль обрабатывается как commonjs
//       'encoding': 'commonjs encoding', // Указываем, что модуль обрабатывается как commonjs
//       '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage' // Указываем, что модуль обрабатывается как commonjs
//     };

//     return config;
//   },
//   //  Разрешаем кросс-доменные запросы при разработке
//   //  Укажите здесь IP вашего локального сервера, если необходимо.
//   // allowedDevOrigins: ['http://10.20.51.2:3000'],
// };

// module.exports = nextConfig;








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
    '@metamask/sdk',
    '@walletconnect/ethereum-provider',    
  ],
  outputFileTracingRoot: __dirname,
  webpack: (config, { isServer }) => {
    // Добавляем alias для @react-native-async-storage
    config.resolve.alias['@react-native-async-storage/async-storage'] = require.resolve('./emptyModule.js');

    // Обрабатываем pino как ES Module c помощью добавления правила для .mjs файлов
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/esm',
    });

    // Важно: убедитесь, что pino обрабатывается как ES модуль
    config.resolve.alias['pino'] = require.resolve('pino/browser');
    config.experiments = { ...config.experiments, topLevelAwait: true };

    // Возвращаем измененную конфигурацию
    return config;
  },
  //  Разрешаем кросс-доменные запросы при разработке
  //  Укажите здесь IP вашего локального сервера, если необходимо.
  // allowedDevOrigins: ['http://10.20.51.2:3000'],
};

module.exports = nextConfig;






// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['ipfs.io'],
//   },
//   transpilePackages: [
//     '@wagmi/core',
//     '@wagmi/chains',
//     '@wagmi/connectors',
//     '@metamask/sdk', // Добавляем @metamask/sdk для транспиляции
//   ],
//   outputFileTracingRoot: __dirname, // Добавляем эту строку. __dirname - текущая директория, корень проекта
//   webpack: (config) => {
//     // Добавляем alias для разрешения "@react-native-async-storage/async-storage"
//     config.resolve.alias['@react-native-async-storage/async-storage'] = require.resolve('./emptyModule.js');
//     return config;
//   },
// };

// module.exports = nextConfig;