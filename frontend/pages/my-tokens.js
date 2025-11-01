// Задача: Отображает NFT, созданные и принадлежащие текущему пользователю. Это страница, где пользователь может видеть свои NFT.
// Импорты:Аналогичны index.js, плюс:
// InstallMetamask (../src/components/molecules/InstallMetamask): Компонент, предлагающий установить Metamask, если он не установлен.
// ConnectWalletMessage (../src/components/molecules/ConnectWalletMessage): Компонент, предлагающий подключить кошелек, если он не подключен.
// mapCreatedAndOwnedTokenIdsAsMarketItems, getUniqueOwnedAndCreatedTokenIds (../src/utils/token): 
// Функции для получения и преобразования данных о NFT пользователя.
// Логика:
// Получает учетную запись пользователя (account), контракты и статус подключения из Web3Context.
// При монтировании компонента загружает ID всех NFT, созданных и принадлежащих пользователю (getUniqueOwnedAndCreatedTokenIds).
// Используя полученные id, извлекает информацию об NFT (mapCreatedAndOwnedTokenIdsAsMarketItems).
// Отображает список NFT с помощью TokenCardList.
// Отображает сообщения, если Metamask не установлен или кошелек не подключен.
// Отображает индикатор загрузки, если данные еще не загружены.

import { LinearProgress } from '@mui/material';
import { useContext, useEffect, useState, useCallback } from 'react';
import InstallMetamask from '../src/components/molecules/InstallMetamask';
import TokenCardList from '../src/components/organisms/TokenCardList';
import { Web3Context } from '../src/components/providers/Web3Provider';
import { mapCreatedAndOwnedTokenIdsAsMarketItems, getUniqueOwnedAndCreatedTokenIds } from '../src/utils/token';
import UnsupportedChain from '../src/components/molecules/UnsupportedChain';
import ConnectWalletMessage from '../src/components/molecules/ConnectWalletMessage';

export default function MyTokens() {
  const [tokens, setTokens] = useState([]);
  const { account, marketplaceContract, tokenContract, isReady, hasWeb3, network } = useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false);

  useEffect(() => {
    setHasWindowEthereum(!!window.ethereum);
  }, []);

  const loadTokens = useCallback(async () => {
    if (!account || !isReady) return;
    setIsLoading(true);
    try {
      const ids = await getUniqueOwnedAndCreatedTokenIds(tokenContract);
      const myTokens = await Promise.all(ids.map(mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, tokenContract, account)));
      setTokens(myTokens);
    } catch (error) {
      console.error("Ошибка при загрузке Tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account, isReady, marketplaceContract, tokenContract]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  if (!hasWindowEthereum) return <InstallMetamask />;
  if (!hasWeb3) return <ConnectWalletMessage />;
  if (!network) return <UnsupportedChain />;
  if (isLoading) return <LinearProgress />;

  return <TokenCardList items={tokens} setNfts={setTokens} withCreateTokens={true} />;
}












// import { LinearProgress } from '@mui/material'
// import { useContext, useEffect, useState } from 'react'
// import InstallMetamask from '../src/components/molecules/InstallMetamask'
// import NFTCardList from '../src/components/organisms/NFTCardList'
// import { Web3Context } from '../src/components/providers/Web3Provider'
// import { mapCreatedAndOwnedTokenIdsAsMarketItems, getUniqueOwnedAndCreatedTokenIds } from '../src/utils/nft'
// import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
// import ConnectWalletMessage from '../src/components/molecules/ConnectWalletMessage'

// export default function MyNFTs () {
//   const [nfts, setNfts] = useState([]) // Состояние для хранения NFT
//   const { account, marketplaceContract, nftContract, isReady, hasWeb3, network } = useContext(Web3Context) // Получаем данные из контекста
//   const [isLoading, setIsLoading] = useState(true) // Состояние загрузки
//   const [hasWindowEthereum, setHasWindowEthereum] = useState(false) // Проверяем наличие Metamask

//   useEffect(() => {
//     setHasWindowEthereum(window.ethereum) // Устанавливаем состояние при монтировании компонента
//   }, [])

//   useEffect(() => {
//     loadNFTs() // Загружаем NFT при изменении account или isReady
//   }, [account, isReady])

//   async function loadNFTs () {
//     if (!isReady || !hasWeb3) return // Выходим, если Web3 не готов

//     try {
//       const myUniqueCreatedAndOwnedTokenIds = await getUniqueOwnedAndCreatedTokenIds(nftContract) // Получаем ID созданных и принадлежащих токенов
//       const myNfts = await Promise.all(myUniqueCreatedAndOwnedTokenIds.map( // Преобразуем ID в объекты NFT
//         mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)
//       ))
//       setNfts(myNfts) // Обновляем состояние NFT
//     } catch (error) {
//       console.error("Ошибка при загрузке NFT:", error) // Логируем ошибку
//     } finally {
//       setIsLoading(false) // Завершаем загрузку
//     }
//   }

//   if (!hasWindowEthereum) return <InstallMetamask/> // Если нет Metamask
//   if (!hasWeb3) return <ConnectWalletMessage/> // Если кошелек не подключен
//   if (!network) return <UnsupportedChain/> // Если сеть не поддерживается
//   if (isLoading) return <LinearProgress/> // Если идет загрузка

//   return (
//     <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={true}/> // Отображаем список NFT
//   )
// }