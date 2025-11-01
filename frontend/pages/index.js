// Загружает доступные NFT из смарт-контракта через marketplaceContract.fetchAvailableMarketItems(). Использует функцию mapAvailableMarketItems для форматирования данных.
// Состояние: Управляет состоянием nfts

// Задача: Отображает список доступных для покупки NFT, полученных с маркетплейса. Это главная страница приложения.
// Импорты:
// useContext, useEffect, useState, useCallback (react): Управление состоянием, жизненным циклом компонента и мемоизация функций.
// TokenCardList (../src/components/organisms/TokenCardList): Компонент для отображения списка NFT в виде карточек.
// Web3Context (../src/components/providers/Web3Provider): Контекст с информацией о подключении к web3, контрактах и учетной записи.
// LinearProgress (MUI): Индикатор загрузки.
// UnsupportedChain (../src/components/molecules/UnsupportedChain): Компонент, отображаемый, если сеть не поддерживается.
// mapAvailableMarketItems (../src/utils/token): Функция для преобразования данных, полученных из контракта, в формат, удобный для отображения.
// Логика:
// Получает контракт маркетплейса из Web3Context.
// При монтировании компонента (useEffect) загружает список доступных NFT с маркетплейса (fetchAvailableMarketItems).
// Использует mapAvailableMarketItems для преобразования данных.
// Отображает список NFT с помощью TokenCardList.
// Отображает индикатор загрузки, если данные еще не загружены
import { useContext, useEffect, useState, useCallback } from 'react';
import TokenCardList from '../src/components/organisms/TokenCardList';
import { Web3Context } from '../src/components/providers/Web3Provider';
import { LinearProgress } from '@mui/material';
import UnsupportedChain from '../src/components/molecules/UnsupportedChain';
import { mapAvailableMarketItems } from '../src/utils/token';

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { marketContract, nftContract, isReady, network } = useContext(Web3Context); // marketContract вместо marketplaceContract

  const loadTokens = useCallback(async () => {
    if (!isReady) return;
    setIsLoading(true);
    try {
      const data = await marketContract.fetchAvailableMarketItems(); // Используем marketContract
      const items = await Promise.all(data.map(mapAvailableMarketItems(nftContract, marketContract))); // marketContract
      setTokens(items);
    } catch (error) {
      console.error("Ошибка при загрузке токенов:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, marketContract, nftContract]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  if (!network) return <UnsupportedChain />;
  if (isLoading) return <LinearProgress />;
  if (!tokens.length) return <h1>No Tokens for sale</h1>;

  return <TokenCardList items={tokens} setNfts={setTokens} withCreateToken={false} />;
}







// import { useContext, useEffect, useState } from 'react'
// import NFTCardList from '../src/components/organisms/NFTCardList'
// import { Web3Context } from '../src/components/providers/Web3Provider'
// import { LinearProgress } from '@mui/material'
// import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
// import { mapAvailableMarketItems } from '../src/utils/nft'

// export default function Home () {
//   const [nfts, setNfts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const { marketplaceContract, nftContract, isReady, network } = useContext(Web3Context)

//   useEffect(() => {
//     loadNFTs()
//   }, [isReady])

//   async function loadNFTs () {
//     if (!isReady) return
//     try {
//       const data = await marketplaceContract.fetchAvailableMarketItems() // Предполагаем, что возвращается массив объектов с информацией о товарах
//       const items = await Promise.all(data.map(mapAvailableMarketItems(nftContract))) // Преобразуем данные
//       setNfts(items)
//     } catch (error) {
//       console.error("Ошибка при загрузке NFT:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (!network) return <UnsupportedChain/>
//   if (isLoading) return <LinearProgress/>
//   if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
//   return (
//     <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={false}/>
//   )
// }