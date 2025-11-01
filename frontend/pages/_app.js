// Это кастомный компонент App в Next.js. Он оборачивает все страницы приложения в WagmiProvider, который предоставляет контекст
//  Wagmi (библиотека для работы с web3).
//  wagmiConfig содержит конфигурацию для Wagmi, включая подключение к сети Sepolia, MetaMask и WalletConnect.


import { WagmiProvider } from 'wagmi';
import wagmiConfig from '../src/config/wagmi-config';
import Web3Provider from '../src/components/providers/Web3Provider';

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </WagmiProvider>
  );
}

export default MyApp;











// import { createConfig, WagmiProvider } from 'wagmi';
// import { sepolia } from '@wagmi/core/chains';
// import { MetaMaskConnector } from '@wagmi/connectors/metaMask';
// import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
// import TokenModalProvider from '../src/components/providers/TokenModalProvider';

// // Замените "YOUR_WALLETCONNECT_PROJECT_ID" на свой реальный Project ID из WalletConnect Cloud
// const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID';

// // Конфигурация Wagmi
// const config = createConfig({
//     autoConnect: true,
//     chains: [sepolia],
//     connectors: [
//         new MetaMaskConnector(), // Создаем экземпляр MetaMaskConnector
//         new WalletConnectConnector({  // Создаем экземпляр WalletConnectConnector
//             options: {
//                 projectId: walletConnectProjectId,
//             },
//         }),
//     ],
// });

// function MyApp({ Component, pageProps }) {
//     return (
//         <WagmiProvider config={config}>
//             <TokenModalProvider>
//                 <Component {...pageProps} />
//             </TokenModalProvider>
//         </WagmiProvider>
//     );
// }

// export default MyApp;










// import { WagmiProvider, createConfig } from 'wagmi';
// import { sepolia } from '@wagmi/core/chains';
// import { MetaMaskConnector } from '@wagmi/connectors/metaMask';
// import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
// import { http } from 'wagmi';
// import TokenModalProvider from '../src/components/providers/TokenModalProvider';

// // Конфигурация Wagmi
// const config = createConfig({
//   autoConnect: true,
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(),
//   },
//   connectors: [
//     new MetaMaskConnector({ chains: [sepolia] }),
//     new WalletConnectConnector({
//       chains: [sepolia],
//       options: { projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID },
//     }),
//   ],
// });

// function MyApp({ Component, pageProps }) {
//   return (
//     <WagmiProvider config={config}>
//       <TokenModalProvider>
//         <Component {...pageProps} />
//       </TokenModalProvider>
//     </WagmiProvider>
//   );
// }

// export default MyApp;
















//  import { WagmiProvider } from 'wagmi';
//    import { sepolia } from '@wagmi/core/chains';
//    //import { MetaMaskConnector, WalletConnectConnector } from '@wagmi/core/connectors'; // Удаляем старый импорт

//    import { MetaMaskConnector } from '@wagmi/connectors/metaMask'; //  Новый импорт
//    import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'; // Новый импорт

//    import { createConfig, http } from '@wagmi/core';
//    import TokenModalProvider from '../src/components/providers/TokenModalProvider';









// // import { WagmiProvider } from 'wagmi';
// // import { sepolia } from '@wagmi/core/chains';
// // import { MetaMaskConnector, WalletConnectConnector } from '@wagmi/core/connectors';
// // import { createConfig, http } from '@wagmi/core';
// // import TokenModalProvider from '../src/components/providers/TokenModalProvider';

// // Конфигурация Wagmi
// const config = createConfig({
//   autoConnect: true,
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(),
//   },
//   connectors: [
//     new MetaMaskConnector({ chains: [sepolia] }),
//     new WalletConnectConnector({
//       chains: [sepolia],
//       options: { projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID },
//     }),
//   ],
// });

// function MyApp({ Component, pageProps }) {
//   return (
//     <WagmiProvider config={config}>
//       <TokenModalProvider>
//         <Component {...pageProps} />
//       </TokenModalProvider>
//     </WagmiProvider>
//   );
// }

// export default MyApp;




































