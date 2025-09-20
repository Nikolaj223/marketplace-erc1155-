import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';
import { makeStyles } from '@mui/styles';
import CardItem from '../molecules/CardItem';
import NFTCreation from '../molecules/NFTCreation';
import ERC20Creation from '../molecules/ERC20Creation';
import { Web3Context } from '../providers/Web3Provider';
import { useContext } from 'react';
import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft';
import { zeroAddress } from 'viem';

const useStyles = makeStyles((theme) => ({
    grid: { spacing: 3, alignItems: 'stretch' },
    gridItem: { display: 'flex', transition: 'all .3s', [theme.breakpoints.down('sm')]: { margin: '0 20px' } }
}));

export default function TokenCardList({ items, setNfts, withCreateNFT, tokenType }) {
    const classes = useStyles();
    const { account, marketplaceContract, nftContract } = useContext(Web3Context);

    // Функция для обновления NFT в списке (если это нужно)
    async function updateNFT(index, tokenId) {
        const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId);
        setNfts(prevNfts => {
            const updatedNfts = [...prevNfts];
            updatedNfts[index] = updatedNFt;
            return updatedNfts;
        });
    }

    // Функция для добавления NFT в список (если поддерживается создание NFT)
    async function addNFTToList(nft) {
        setNfts(prevNfts => [nft, ...prevNfts]);
    }
     // Функция для добавления ERC20 в список
     async function addERC20ToList(erc20) {
        setNfts(prevNfts => [erc20, ...prevNfts]);
    }

    return (
        <InfiniteScroll dataLength={items.length} loader={<LinearProgress />}>
            <Grid container className={classes.grid} id="grid">
                {/* Компонент для создания контента, выбирается на основе tokenType */}
                {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
                    {tokenType === 'nft' ? (
                        <NFTCreation addNFTToList={addNFTToList} />
                    ) : (
                        <ERC20Creation addERC20ToList={addERC20ToList} />
                    )}
                </Grid>}
                {/* Отображение списка карточек (NFTs или ERC20s) */}
                {items.map((item, i) => (
                    <Fade in={true} key={i}>
                        <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
                            <CardItem item={item} type={item.type} />
                        </Grid>
                    </Fade>
                ))}
            </Grid>
        </InfiniteScroll>
    );
}







// import InfiniteScroll from 'react-infinite-scroll-component';
// import Grid from '@mui/material/Grid';
// import LinearProgress from '@mui/material/LinearProgress';
// import Fade from '@mui/material/Fade';
// import { makeStyles } from '@mui/styles';
// import CardItem from '../molecules/CardItem'; // Универсальный компонент карточки
// import NFTCardCreation from '../molecules/NFTCardCreation';
// import { Web3Context } from '../providers/Web3Provider';
// import { useContext } from 'react';
// import { mapCreatedAndOwnedTokenIdsAsMarketItems } from '../../utils/nft';
// import { zeroAddress } from 'viem';

// const useStyles = makeStyles((theme) => ({
//     grid: { spacing: 3, alignItems: 'stretch' },
//     gridItem: { display: 'flex', transition: 'all .3s', [theme.breakpoints.down('sm')]: { margin: '0 20px' } }
// }));

// export default function NFTCardList({ items, setNfts, withCreateNFT }) {
//     // items - массив объектов, каждый из которых имеет поле type ("erc20" или "nft") и остальные данные
//     const classes = useStyles();
//     const { account, marketplaceContract, nftContract } = useContext(Web3Context); // Предполагаем, что context нужен и для ERC20

//     async function updateNFT(index, tokenId) {
//         const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItems(marketplaceContract, nftContract, account)(tokenId);
//         setNfts(prevNfts => {
//             const updatedNfts = [...prevNfts];
//             updatedNfts[index] = updatedNFt;
//             return updatedNfts;
//         });
//     }

//     async function addNFTToList(nft) {
//         setNfts(prevNfts => [nft, ...prevNfts]);
//     }

//     return (
//         <InfiniteScroll dataLength={items.length} loader={<LinearProgress />}>
//             <Grid container className={classes.grid} id="grid">
//                 {withCreateNFT && <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
//                     <NFTCardCreation addNFTToList={addNFTToList} />
//                 </Grid>}
//                 {items.map((item, i) => (
//                     <Fade in={true} key={i}>
//                         <Grid item xs={12} sm={6} md={3} className={classes.gridItem}>
//                             <CardItem item={item} type={item.type}  /> {/* Передаем тип */}
//                         </Grid>
//                     </Fade>
//                 ))}
//             </Grid>
//         </InfiniteScroll>
//     );
// }







































