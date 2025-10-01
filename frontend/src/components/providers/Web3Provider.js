import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useNetwork, useConnect, useDisconnect, useContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// Импортируем ABI из папки artifacts
import TestTokenABI from '../../../../backend/artifacts/contracts/TestToken.sol/TestToken.json';
import TestERC20ABI from '../../../../backend/artifacts/contracts/TestERC20.sol/TestERC20.json';
import MarketplaceABI from '../../../../backend/artifacts/contracts/Marketplace.sol/Marketplace.json';
import BlacklistControlABI from '../../../../backend/artifacts/contracts/BlacklistControl.sol/BlacklistControl.json';

const networkNames = {
    [sepolia.id]: 'Sepolia Testnet',
};

const contractAddresses = {
    [sepolia.id]: {
        marketplaceContract: process.env.MARKETPLACE_CONTRACT_ADDRESS_SEPOLIA,
        nftContract: process.env.TestToken_ADDRESS_SEPOLIA,
        erc20Contract: process.env.TEST_ERC20_CONTRACT_ADDRESS_SEPOLIA,
        blacklistContract: process.env.BLACKLIST_CONTRACT_ADDRESS_SEPOLIA,
    },
};

export const Web3Context = createContext();
export const useWeb3Context = () => useContext(Web3Context);

export default function Web3Provider({ children }) {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { connect, connectors } = useConnect();
    const { balance } = useBalance({ address });
    const { disconnect } = useDisconnect();

    const [networkName, setNetworkName] = useState(networkNames[sepolia.id]);

    // Используем ABI при создании контрактов
    const nftContract = useContract({
        address: chain?.id === sepolia.id ? contractAddresses[sepolia.id].nftContract : null,
        abi: TestTokenABI,
    });

    const marketContract = useContract({
        address: chain?.id === sepolia.id ? contractAddresses[sepolia.id].marketplaceContract : null,
        abi: MarketplaceABI,
    });

    const erc20Contract = useContract({
        address: chain?.id === sepolia.id ? contractAddresses[sepolia.id].erc20Contract : null,
        abi: TestERC20ABI,
    });

    const blacklistContract = useContract({
        address: chain?.id === sepolia.id ? contractAddresses[sepolia.id].blacklistContract : null,
        abi: BlacklistControlABI,
    });

    useEffect(() => {
        if (chain?.id) {
            setNetworkName(networkNames[chain.id] || chain.name);
        }
    }, [chain]);

    const isReady = isConnected && nftContract.address && marketContract.address && erc20Contract.address && blacklistContract.address;
    const hasWeb3 = true;

    return (
        <Web3Context.Provider
            value={{
               account: address,
                 network: networkName,
                 balance: balance?.formatted || 0,
                isConnected,
                isReady,
               hasWeb3,
                connect: (connectorId) => {
                const connector = connectors.find(c => c.id === connectorId);
                if (connector) connect({ connector });
        },
        disconnect,
            nftContract: nftContract.contract,
            marketContract: marketContract.contract,
            erc20Contract: erc20Contract.contract,
            blacklistContract: blacklistContract.contract,
    }}
        >
        {children}
        </Web3Context.Provider>
    );
}






// import { createContext, useEffect, useState } from 'react';
// import { useAccount, useBalance, useNetwork, useConnect, useDisconnect } from 'wagmi';
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'; // Если используете
// import { zeroAddress } from 'viem'; // Для ethers.constants.AddressZero

// // Предполагается, что у вас есть этот объект, если он используется для отображения названий сетей
// const networkNames = {
//   // Пример:
//   hardhat: 'Localhost',
//   goerli: 'Goerli Testnet',
//   polygonMumbai: 'Polygon Mumbai Testnet', // Добавьте свою сеть
//   // ... другие сети
// };

// export const Web3Context = createContext({
//   account: null,
//   network: null,
//   balance: null,
//   isConnected: false,
//   isReady: false,
//   hasWeb3: false,
//   connect: () => {}, // Пустая функция для инициализации
//   disconnect: () => {},
//   connectors: [],
// });

// export default function Web3Provider({ children }) {
//   // Wagmi Hooks для получения данных
//   const { address, isConnected, connector } = useAccount(); // account, isConnected
//   const { data: balanceData, isLoading: isBalanceLoading } = useBalance({ address, watch: true }); // balance
//   const { chain } = useNetwork(); // network
//   const { connect, connectors, isLoading: isConnecting } = useConnect(); // connect functionality
//   const { disconnect } = useDisconnect(); // disconnect functionality

//   // Состояния, которые вы можете использовать для преобразования данных Wagmi в удобный формат
//   const [networkName, setNetworkName] = useState(null);

//   useEffect(() => {
//     if (chain?.name) {
//       setNetworkName(networkNames[chain.name] || chain.name);
//     } else {
//       setNetworkName(null);
//     }
//   }, [chain]);

//   // Можно удалить initializeWeb3 полностью, так как Wagmi обрабатывает подключение.
//   // Если вам нужна кнопка "Connect Wallet", вызовите connect({ connector: ... }) напрямую.
//   // const initializeWeb3 = async () => { /* ... */ }; // Эту функцию можно убрать

//   // Определения для value
//   const account = address || null;
//   const isReady = isConnected; // Если кошелек подключен, считаем, что Web3 готов
//   const hasWeb3 = true; // С Wagmi всегда true, так как он сам по себе "наличие Web3"

//   return (
//     <Web3Context.Provider
//       value={{
//         account,
//         network: networkName, // Отображаемое имя сети
//         balance: balanceData?.formatted ? parseFloat(balanceData.formatted) : 0, // Баланс в виде числа
//         isConnected, // Проверка, подключен ли пользователь
//         isReady, // Готовность к взаимодействию
//         hasWeb3, // Доступность Web3-окружения
//         connect: (connectorId) => {
//             // Функция для подключения, если вы хотите вызвать её из UI (например, из NavBar)
//             const conn = connectors.find(c => c.id === connectorId);
//             if (conn) connect({ connector: conn });
//         },
//         disconnect,
//         connectors // Передаем список доступных коннекторов для рендеринга кнопок
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// }