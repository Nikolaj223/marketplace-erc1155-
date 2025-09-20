//  Этот файл в основном содержит утилиты для взаимодействия с Web3-провайдером на низком уровне и определения параметров сети. 
// При переходе на wagmi большая часть его функциональности либо устареет,
//   либо будет заменена на более современные и интегрированные подходы wagmi/viem.
import { configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Определение поддерживаемых сетей (Sepolia)
const { chains, publicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

// Конфигурация Wagmi
const wagmiConfig = createConfig({
  chains,
  publicClient,
  connectors: [
    new MetaMaskConnector(), // Добавляем MetaMask коннектор
  ],
});

// Функция для определения типа кошелька (только MetaMask)
function getProvider() {
  if (window?.ethereum?.isMetaMask) {
    return 'MetaMask';
  }
  return 'Wallet'; // Общий случай
}

export { wagmiConfig, chains, getProvider };