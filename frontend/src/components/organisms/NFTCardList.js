import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';
import { makeStyles } from '@mui/styles';
import CardItem from '../molecules/CardItem'; // Универсальный компонент карточки
import NFTCardCreation from '../molecules/NFTCardCreation';
import { Web3Context } from '../providers/Web3Provider';
import { useContext } from 'react';
import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft';
import { zeroAddress } from 'viem';

const useStyles = makeStyles((theme) => ({
    grid: { spacing: 3, alignItems: 'stretch' },
    gridItem: { display: 'flex', transition: 'all .3s', [theme.breakpoints.down('sm')]: { margin: '0 20px' } }
}));

export default function NFTCardList({ items, setNfts, withCreateNFT }) {
    // items - массив объектов, каждый из которых имеет поле type ("erc20" или "nft") и остальные данные
    const classes = useStyles();
    const { account, marketplaceContract, nftContract } = useContext(Web3Context); // Предполагаем, что context нужен и для ERC20

    async function updateNFT(index, tokenId) {
        const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId);
        setNfts(prevNfts => {
            const updatedNfts = [...prevNfts];
            updatedNfts[index] = updatedNFt;
            return updatedNfts;
        });
    }

    async function addNFTToList(nft) {
        setNfts(prevNfts => [nft, ...prevNfts]);
    }

    return (
        <InfiniteScroll dataLength={items.length} loader={<LinearProgress />}>
            <Grid container className={classes.grid} id="grid">
                {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
                    <NFTCardCreation addNFTToList={addNFTToList} />
                </Grid>}
                {items.map((item, i) => (
                    <Fade in={true} key={i}>
                        <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
                            <CardItem item={item} type={item.type}  /> {/* Передаем тип */}
                        </Grid>
                    </Fade>
                ))}
            </Grid>
        </InfiniteScroll>
    );
}













// import InfiniteScroll from 'react-infinite-scroll-component'
// import Grid from '@mui/material/Grid'
// import LinearProgress from '@mui/material/LinearProgress'
// import Fade from '@mui/material/Fade'
// import { makeStyles } from '@mui/styles'
// import NFTCard from '../molecules/NFTCard'
// import NFTCardCreation from '../molecules/NFTCardCreation'
// //import { ethers } from 'ethers' // Закомментируйте импорт ethers, если используете wagmi
// import { Web3Context } from '../providers/Web3Provider'
// import { useContext } from 'react'
// import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft'
// import { zeroAddress } from 'viem';// Импортируем zeroAddress из viem

// const useStyles = makeStyles((theme) => ({
//   grid: {
//     spacing: 3,
//     alignItems: 'stretch'
//   },
//   gridItem: {
//     display: 'flex',
//     transition: 'all .3s',
//     [theme.breakpoints.down('sm')]: {
//       margin: '0 20px'
//     }
//   }
// }))

// export default function NFTCardList ({ nfts, setNfts, withCreateNFT }) {
//   const classes = useStyles()
//   const { account, marketplaceContract, nftContract } = useContext(Web3Context)

//   async function updateNFT (index, tokenId) {
//     const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
//     setNfts(prevNfts => {
//       const updatedNfts = [...prevNfts]
//       updatedNfts[index] = updatedNFt
//       return updatedNfts
//     })
//   }

//   async function addNFTToList (tokenId) {
//     const nft = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
//     setNfts(prevNfts => [nft, ...prevNfts])
//   }

//   function NFT ({ nft, index }) {
//     if (!nft.owner) {
//       return <NFTCardCreation addNFTToList={addNFTToList}/>
//     }

//     if (nft.owner === account && nft.marketItemId && !nft.hasMarketApproval) {
//       return <NFTCard nft={nft} action="approve" updateNFT={() => updateNFT(index, nft.tokenId)}/>
//     }

//     if (nft.owner === account) {
//       return <NFTCard nft={nft} action="sell" updateNFT={() => updateNFT(index, nft.tokenId)}/>
//     }

//     if (nft.seller === account && !nft.sold) {
//       return <NFTCard nft={nft} action="cancel" updateNFT={() => updateNFT(index, nft.tokenId)} />
//     }

//     if (nft.owner === zeroAddress) { // Используем zeroAddress из viem
//       return <NFTCard nft={nft} action="buy" updateNFT={() => updateNFT(index, nft.tokenId)} />
//     }

//     return <NFTCard nft={nft} action="none"/>
//   }

//   return (
//     <InfiniteScroll
//       dataLength={nfts.length}
//       loader={<LinearProgress />}
//     >
//       <Grid container className={classes.grid} id="grid">
//         {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
//           <NFTCardCreation addNFTToList={addNFTToList}/>
//         </Grid>}
//         {nfts.map((nft, i) =>
//           <Fade in={true} key={i}>
//             <Grid item xs={12} sm={6} md={3} className={classes.gridItem} >
//                 <NFT nft={nft} index={i} />
//             </Grid>
//           </Fade>
//         )}
//       </Grid>
//     </InfiniteScroll>
//   )
// }



























// import InfiniteScroll from 'react-infinite-scroll-component'
// import Grid from '@mui/material/Grid'
// import LinearProgress from '@mui/material/LinearProgress'
// import Fade from '@mui/material/Fade'
// import { makeStyles } from '@mui/styles'
// import NFTCard from '../molecules/NFTCard'
// import NFTCardCreation from '../molecules/NFTCardCreation'
// import { ethers } from 'ethers'
// import { Web3Context } from '../providers/Web3Provider'
// import { useContext } from 'react'
// import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft'

// const useStyles = makeStyles((theme) => ({
//   grid: {
//     spacing: 3,
//     alignItems: 'stretch'
//   },
//   gridItem: {
//     display: 'flex',
//     transition: 'all .3s',
//     [theme.breakpoints.down('sm')]: {
//       margin: '0 20px'
//     }
//   }
// }))

// export default function NFTCardList ({ nfts, setNfts, withCreateNFT }) {
//   const classes = useStyles()
//   const { account, marketplaceContract, nftContract } = useContext(Web3Context)

//   async function updateNFT (index, tokenId) {
//     const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
//     setNfts(prevNfts => {
//       const updatedNfts = [...prevNfts]
//       updatedNfts[index] = updatedNFt
//       return updatedNfts
//     })
//   }

//   async function addNFTToList (tokenId) {
//     const nft = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId)
//     setNfts(prevNfts => [nft, ...prevNfts])
//   }

//   function NFT ({ nft, index }) {
//     if (!nft.owner) {
//       return <NFTCardCreation addNFTToList={addNFTToList}/>
//     }

//     if (nft.owner === account && nft.marketItemId && !nft.hasMarketApproval) {
//       return <NFTCard nft={nft} action="approve" updateNFT={() => updateNFT(index, nft.tokenId)}/>
//     }

//     if (nft.owner === account) {
//       return <NFTCard nft={nft} action="sell" updateNFT={() => updateNFT(index, nft.tokenId)}/>
//     }

//     if (nft.seller === account && !nft.sold) {
//       return <NFTCard nft={nft} action="cancel" updateNFT={() => updateNFT(index, nft.tokenId)} />
//     }

//     if (nft.owner === ethers.constants.AddressZero) {
//       return <NFTCard nft={nft} action="buy" updateNFT={() => updateNFT(index, nft.tokenId)} />
//     }

//     return <NFTCard nft={nft} action="none"/>
//   }

//   return (
//     <InfiniteScroll
//       dataLength={nfts.length}
//       loader={<LinearProgress />}
//     >
//       <Grid container className={classes.grid} id="grid">
//         {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
//           <NFTCardCreation addNFTToList={addNFTToList}/>
//         </Grid>}
//         {nfts.map((nft, i) =>
//           <Fade in={true} key={i}>
//             <Grid item xs={12} sm={6} md={3} className={classes.gridItem} >
//                 <NFT nft={nft} index={i} />
//             </Grid>
//           </Fade>
//         )}
//       </Grid>
//     </InfiniteScroll>
//   )
// }

// Для их полноценной работы вам понадобятся:
//   Соответствующие "молекулы": NFTCard.js, NFTCardCreation.js, NFTModalContent.js.
//   Провайдеры контекста: Web3Provider.js и NFTModalProvider.js.
//   Вспомогательные утилиты: ../../utils/nft.js.


// import InfiniteScroll from 'react-infinite-scroll-component';
// import Grid from '@mui/material/Grid';
// import LinearProgress from '@mui/material/LinearProgress';
// import Fade from '@mui/material/Fade';
// import { makeStyles } from '@mui/styles';
// import NFTCard from '../molecules/NFTCard';
// import NFTCardCreation from '../molecules/NFTCardCreation';
// import { useContext } from 'react';
// import { Web3Context } from '../providers/Web3Provider';
// import { useContractRead } from 'wagmi';

// const useStyles = makeStyles((theme) => ({/*стили*/}));

// export default function NFTCardList({ nfts, setNfts, withCreateNFT }) {
//     const classes = useStyles();
//     const { account, marketplaceContract, nftContract } = useContext(Web3Context);

//     // Хук для чтения с контракта, получает информацию о NFT
// , можно динамически менять если нужно
//     });

//     async function updateNFT(index, tokenId) {
//         // TODO: Обновление NFT, если нужно обновить данные конкретного NFT
//     }

//     async function addNFTToList(tokenId) {
//         // TODO: Добавление NFT в список
//     }

//     function NFT({ nft, index }) {
//         // Отображение NFT карточки
//         return <NFTCard nft={nft} action="none" />;
//     }

//     return (/*отображение списка NFT*/);
// }