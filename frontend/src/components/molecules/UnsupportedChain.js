//  информирует пользователя, что его кошелек подключен к неподдерживаемой блокчейн-сети, 
// и предлагает кнопку для переключения или добавления правильной сети.
// Компонент, информирующий пользователя о неподдерживаемой сети.

//  Этот компонент информирует пользователя, что его кошелек подключен к неподдерживаемой блокчейн-сети,
// и предлагает кнопку для переключения или добавления правильной сети.
import { Button } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../providers/Web3Provider';
import PageMessageBox from './PageMessageBox';
import { sepolia } from 'wagmi/chains';
import { ethers } from 'ethers';

const toHex = (num) => '0x' + num.toString(16);

async function addNetwork(chain) {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: toHex(chain.id),
        chainName: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpcUrls,
        blockExplorerUrls: chain.blockExplorers?.map(explorer => explorer.url),
      }],
    });
  } catch (error) {
    console.error('Error adding network:', error);
  }
}

export default function UnsupportedChain() {
  const { isConnected } = useContext(Web3Context);
  const [currentChainId, setCurrentChainId] = useState(null);

  useEffect(() => {
    // Получаем текущий chainId при монтировании компонента и при изменении isConnected
    const getChainId = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          setCurrentChainId(network.chainId);
        } catch (error) {
          console.error('Error getting chainId:', error);
        }
      }
    };

    getChainId(); // Вызываем при монтировании
  }, [isConnected]); // Зависимость от isConnected: если кошелек переподключится - обновим chainId

  const handleClick = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: toHex(sepolia.id) }], // Переключаемся на Sepolia
        });
      } catch (switchError) {
        if (switchError.code === 4902) { // Код ошибки, если сеть не добавлена
          await addNetwork(sepolia); // Если сеть не добавлена, добавляем
        } else {
          console.error('Error switching chain:', switchError);
        }
      }
    }
  };

  const isCorrectChain = currentChainId === sepolia.id; // Сравниваем chainId с Sepolia

  return (
    <PageMessageBox text="This blockchain is not supported.">
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClick}
        sx={{ maxWidth: 600, margin: 'auto', display: 'flex', justifyContent: 'center' }}
        disabled={!isConnected}
      >
        {isConnected
          ? isCorrectChain
            ? 'Connected to Sepolia'
            : `Switch to ${sepolia.name}`
          : 'Connect Wallet'}
      </Button>
    </PageMessageBox>
  );
}