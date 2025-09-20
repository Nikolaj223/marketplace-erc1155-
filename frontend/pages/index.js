// Загружает доступные NFT из смарт-контракта через marketplaceContract.fetchAvailableMarketItems(). Использует функцию mapAvailableMarketItems для форматирования данных.
// Состояние: Управляет состоянием nfts
import { useContext, useEffect, useState } from 'react'
import TokenCardList from '../src/components/organisms/TokenCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/token'

export default function Home () {
  const [tokens, setTokens] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { marketplaceContract, tokenContract, isReady, network } = useContext(Web3Context)

  useEffect(() => {
    loadTokens()
  }, [isReady])

  async function loadTokens () {
    if (!isReady) return
    try {
      // Fetch available market items from the marketplace contract
      const data = await marketplaceContract.fetchAvailableMarketItems()
      // Map the fetched data to a format suitable for display
      const items = await Promise.all(data.map(mapAvailableMarketItems(tokenContract)))
      setTokens(items)
    } catch (error) {
      console.error("Ошибка при загрузке Token:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Display different UI elements based on the app's state
  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>
  if (!isLoading && !tokens.length) return <h1>No Tokens for sale</h1>
  return (
    <TokenCardList items={tokens} setNfts={setTokens} withCreateToken={false}/>
  )
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