import { LinearProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import InstallMetamask from '../src/components/molecules/InstallMetamask'
import TokenCardList from '../src/components/organisms/TokenCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { mapCreatedAndOwnedTokenIdsAsMarketItems, getUniqueOwnedAndCreatedTokenIds } from '../src/utils/token'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import ConnectWalletMessage from '../src/components/molecules/ConnectWalletMessage'

export default function MyTOKENs () {
  const [tokens, setTokens] = useState([])
  const { account, marketplaceContract, tokenContract, isReady, hasWeb3, network } = useContext(Web3Context)
  const [isLoading, setIsLoading] = useState(true)
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false)

  useEffect(() => {
    setHasWindowEthereum(window.ethereum)
  }, [])

  useEffect(() => {
    loadTokens()
  }, [account, isReady])

  async function loadTokens () {
    if (!isReady || !hasWeb3) return

    try {
      const myUniqueCreatedAndOwnedTokenIds = await getUniqueOwnedAndCreatedTokenIds(tokenContract) // Получаем все tokenId, которыми владеет пользователь и которые он создал
      const myTokens = await Promise.all(myUniqueCreatedAndOwnedTokenIds.map(
        mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, tokenContract, account) // Преобразуем tokenId в объекты NFT с инфой о маркетплейсе
      ))
      setNfts(myTokens)
    } catch (error) {
      console.error("Ошибка при загрузке Tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Рендерим компоненты в зависимости от состояния web3
  if (!hasWindowEthereum) return <InstallMetamask/>
  if (!hasWeb3) return <ConnectWalletMessage/>
  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>

  return (
    <TokenCardList items={tokens} setNfts={setTokens} withCreateTokens={true}/> //Обязательно items вместо nfts
  )
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