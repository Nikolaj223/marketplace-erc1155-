// Содержит конфигурацию для Wagmi. Определяет, к каким блокчейн сетям будет подключаться приложение (в данном случае, Sepolia),
//  какие коннекторы кошельков будут использоваться (MetaMask, WalletConnect) и транспорт (http для Sepolia). 
//  ID проекта WalletConnect берется из переменных окружения.


import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "" }) // Добавь значение по умолчанию
  ],
  transports: {
    [sepolia.id]: http()
  }
});

export default wagmiConfig; // Изменяем экспорт на default

// import { createConfig } from 'wagmi';
// import { sepolia } from '@wagmi/core/chains';
// import { MetaMaskConnector } from '@wagmi/core'; 
// import { WalletConnectConnector } from '@wagmi/core';

// const metaMaskConnector = new MetaMaskConnector({ chains: [sepolia] });

// const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
// const walletConnectConnector = new WalletConnectConnector({
//     options: {
//         projectId: walletConnectProjectId,
//     },
// });

// const config = createConfig({
//   autoConnect: true,
//   chains: [sepolia],
//   connectors: [metaMaskConnector, walletConnectConnector],
// })

// export default config;