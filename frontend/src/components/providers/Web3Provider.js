import { createContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useNetwork, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'; // Если используете
import { zeroAddress } from 'viem'; // Для ethers.constants.AddressZero

// Предполагается, что у вас есть этот объект, если он используется для отображения названий сетей
const networkNames = {
  // Пример:
  hardhat: 'Localhost',
  goerli: 'Goerli Testnet',
  polygonMumbai: 'Polygon Mumbai Testnet', // Добавьте свою сеть
  // ... другие сети
};

export const Web3Context = createContext({
  account: null,
  network: null,
  balance: null,
  isConnected: false,
  isReady: false,
  hasWeb3: false,
  connect: () => {}, // Пустая функция для инициализации
  disconnect: () => {},
  connectors: [],
});

export default function Web3Provider({ children }) {
  // Wagmi Hooks для получения данных
  const { address, isConnected, connector } = useAccount(); // account, isConnected
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({ address, watch: true }); // balance
  const { chain } = useNetwork(); // network
  const { connect, connectors, isLoading: isConnecting } = useConnect(); // connect functionality
  const { disconnect } = useDisconnect(); // disconnect functionality

  // Состояния, которые вы можете использовать для преобразования данных Wagmi в удобный формат
  const [networkName, setNetworkName] = useState(null);

  useEffect(() => {
    if (chain?.name) {
      setNetworkName(networkNames[chain.name] || chain.name);
    } else {
      setNetworkName(null);
    }
  }, [chain]);

  // Можно удалить initializeWeb3 полностью, так как Wagmi обрабатывает подключение.
  // Если вам нужна кнопка "Connect Wallet", вызовите connect({ connector: ... }) напрямую.
  // const initializeWeb3 = async () => { /* ... */ }; // Эту функцию можно убрать

  // Определения для value
  const account = address || null;
  const isReady = isConnected; // Если кошелек подключен, считаем, что Web3 готов
  const hasWeb3 = true; // С Wagmi всегда true, так как он сам по себе "наличие Web3"

  return (
    <Web3Context.Provider
      value={{
        account,
        network: networkName, // Отображаемое имя сети
        balance: balanceData?.formatted ? parseFloat(balanceData.formatted) : 0, // Баланс в виде числа
        isConnected, // Проверка, подключен ли пользователь
        isReady, // Готовность к взаимодействию
        hasWeb3, // Доступность Web3-окружения
        connect: (connectorId) => {
            // Функция для подключения, если вы хотите вызвать её из UI (например, из NavBar)
            const conn = connectors.find(c => c.id === connectorId);
            if (conn) connect({ connector: conn });
        },
        disconnect,
        connectors // Передаем список доступных коннекторов для рендеринга кнопок
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}