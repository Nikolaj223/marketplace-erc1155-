import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { sepolia } from 'wagmi/chains';
import TestTokenABI from '../../../public/TestToken.json';
import TestERC20ABI from '../../../public/TestERC20.json';
import MarketplaceABI from '../../../public/Marketplace.json';
import BlacklistControlABI from '../../../public/BlacklistControl.json';

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
    const [account, setAccount] = useState(null);
    const [network, setNetwork] = useState('Unknown');
    const [balance, setBalance] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [nftContract, setNftContract] = useState(null);
    const [marketContract, setMarketContract] = useState(null);
    const [erc20Contract, setErc20Contract] = useState(null);
    const [blacklistContract, setBlacklistContract] = useState(null);
    const hasWeb3 = true;
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const setupWeb3 = async () => {
            if (window.ethereum) {
                setIsLoading(true)
                try {
                    // Сначала проверяем, подключен ли уже аккаунт
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setIsConnected(true);
                    } else {
                        // Запрашиваем доступ к аккаунтам, если еще не подключены
                        const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        if (newAccounts.length > 0) {
                            setAccount(newAccounts[0]);
                            setIsConnected(true);
                        }
                    }


                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();

                    setAccount(address);
                    setIsConnected(true);

                    const networkInfo = await provider.getNetwork();
                    setNetwork(networkInfo.name);

                    const balanceWei = await provider.getBalance(address);
                    const balanceEther = ethers.formatEther(balanceWei);
                    setBalance(balanceEther);

                    if (contractAddresses[sepolia.id]) {
                        const { nftContract: nftAddress, marketplaceContract: marketAddress, erc20Contract: erc20Address, blacklistContract: blacklistAddress } = contractAddresses[sepolia.id];

                        if (nftAddress) setNftContract(new ethers.Contract(nftAddress, TestTokenABI, signer));
                        if (marketAddress) setMarketContract(new ethers.Contract(marketAddress, MarketplaceABI, signer));
                        if (erc20Address) setErc20Contract(new ethers.Contract(erc20Address, TestERC20ABI, signer));
                        if (blacklistAddress) setBlacklistContract(new ethers.Contract(blacklistAddress, BlacklistControlABI, signer));
                    }
                } catch (error) {
                    console.error("Ошибка при инициализации Web3:", error);
                } finally {
                  setIsLoading(false)
                }
            }
        };

        setupWeb3();
    }, []);

   // Пока идет загрузка, можно показывать сообщение
    if (isLoading) {
        return <div>Подключение к MetaMask...</div>;
    }

    const values = {
        account,
        network,
        balance,
        isConnected,
        hasWeb3,
        nftContract,
        marketContract,
        erc20Contract,
        blacklistContract,
    };

    return (
        <Web3Context.Provider value={values}>
            {children}
        </Web3Context.Provider>
    );
}






// import { createContext, useContext, useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import { sepolia } from 'wagmi/chains';
// import TestTokenABI from '../../../../backend/artifacts/contracts/TestToken.sol/TestToken.json';
// import TestERC20ABI from '../../../../backend/artifacts/contracts/TestERC20.sol/TestERC20.json';
// import MarketplaceABI from '../../../../backend/artifacts/contracts/Marketplace.sol/Marketplace.json';
// import BlacklistControlABI from '../../../../backend/artifacts/contracts/BlacklistControl.sol/BlacklistControl.json';

// const contractAddresses = {
//     [sepolia.id]: {
//         marketplaceContract: process.env.MARKETPLACE_CONTRACT_ADDRESS_SEPOLIA,
//         nftContract: process.env.TestToken_ADDRESS_SEPOLIA,
//         erc20Contract: process.env.TEST_ERC20_CONTRACT_ADDRESS_SEPOLIA,
//         blacklistContract: process.env.BLACKLIST_CONTRACT_ADDRESS_SEPOLIA,
//     },
// };

// export const Web3Context = createContext();
// export const useWeb3Context = () => useContext(Web3Context);

// export default function Web3Provider({ children }) {
//     const [account, setAccount] = useState(null);
//     const [network, setNetwork] = useState('Unknown');
//     const [balance, setBalance] = useState(0);
//     const [isConnected, setIsConnected] = useState(false);
//     const [nftContract, setNftContract] = useState(null);
//     const [marketContract, setMarketContract] = useState(null);
//     const [erc20Contract, setErc20Contract] = useState(null);
//     const [blacklistContract, setBlacklistContract] = useState(null);
//     const hasWeb3 = true;

//     useEffect(() => {
//         const setupWeb3 = async () => {
//             if (window.ethereum) {
//                 try {
//                     const provider = new ethers.BrowserProvider(window.ethereum);
//                     const signer = await provider.getSigner();
//                     const address = await signer.getAddress();

//                     setAccount(address);
//                     setIsConnected(true);

//                     const networkInfo = await provider.getNetwork();
//                     setNetwork(networkInfo.name);

//                     const balanceWei = await provider.getBalance(address);
//                     const balanceEther = ethers.formatEther(balanceWei);
//                     setBalance(balanceEther);

//                     if (contractAddresses[sepolia.id]) {
//                         const { nftContract: nftAddress, marketplaceContract: marketAddress, erc20Contract: erc20Address, blacklistContract: blacklistAddress } = contractAddresses[sepolia.id];

//                         if (nftAddress) setNftContract(new ethers.Contract(nftAddress, TestTokenABI, signer));
//                         if (marketAddress) setMarketContract(new ethers.Contract(marketAddress, MarketplaceABI, signer));
//                         if (erc20Address) setErc20Contract(new ethers.Contract(erc20Address, TestERC20ABI, signer));
//                         if (blacklistAddress) setBlacklistContract(new ethers.Contract(blacklistAddress, BlacklistControlABI, signer));
//                     }
//                 } catch (error) {
//                     console.error("Ошибка при инициализации Web3:", error);
//                 }
//             }
//         };

//         setupWeb3();
//     }, []);

//     const values = {
//         account,
//         network,
//         balance,
//         isConnected,
//         hasWeb3,
//         nftContract,
//         marketContract,
//         erc20Contract,
//         blacklistContract,
//     };

//     return (
//         <Web3Context.Provider value={values}>
//             {children}
//         </Web3Context.Provider>
//     );
// }




