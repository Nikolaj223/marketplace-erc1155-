import { WagmiProvider, createConfig, configureChains } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from '@wagmi/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';

const { publicClient, webSocketPublicClient } = configureChains(
  [sepolia], // Use Sepolia chain
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains: [sepolia] }), // Use Sepolia chain
    new WalletConnectConnector({
      chains: [sepolia], // Use Sepolia chain
      options: { projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID },
    }),
  ],
});

import TokenModalProvider from '../src/components/providers/TokenModalProvider';

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <TokenModalProvider>
        <Component {...pageProps} />
      </TokenModalProvider>
    </WagmiProvider>
  );
}

export default MyApp;












// import { WagmiProvider, createConfig, configureChains } from 'wagmi';
  //   import { polygonMumbai } from 'wagmi/chains'; // Импортируйте нужную вам цепочку
  //   import { publicProvider } from 'wagmi/providers/public';
  //   import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
  //   import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

  //   // 1. Настройка цепочек и провайдеров
  //   const { publicClient, webSocketPublicClient } = configureChains(
  //     [polygonMumbai], // Добавьте сюда другие цепочки, если нужно (например, hardhat для локальной разработки)
  //     [publicProvider()] // Можно добавить AlchemyProvider, InfuraProvider для продакшена
  //   );

  //   // 2. Настройка коннекторов
  //   const config = createConfig({
  //     autoConnect: true, // Автоматически подключает пользователя, если он уже был подключен
  //     publicClient,
  //     webSocketPublicClient,
  //     connectors: [
  //       new MetaMaskConnector({ chains: [polygonMumbai] }),
  //       new WalletConnectConnector({ 
  //         chains: [polygonMumbai], 
  //         options: { projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID } // ⒷОБЯЗАТЕЛЬНО: Получите Project ID!Ⓑ
  //       }),
  //       // Добавьте другие коннекторы при необходимости
  //     ],
  //   });

  //   // 3. Импорт существующих провайдеров вашего фронтенда
  //   import NFTModalProvider from '../src/providers/NFTModalProvider'; // Из вашей структуры src/providers
  //   // import { Web3Context } from '../src/providers/Web3Provider'; // Возможно, вы удалите этот провайдер или сильно его измените

  //   function MyApp({ Component, pageProps }) {
  //     return (
  //       <WagmiProvider config={config}>
  //         <NFTModalProvider> {/* Оберните в свои провайдеры */}
  //           <Component {...pageProps} />
  //         </NFTModalProvider>
  //       </WagmiProvider>
  //     );
  //   }

  //   export default MyApp;