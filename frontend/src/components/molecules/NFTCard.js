// н объединяет отображение данных NFT, взаимодействие с пользователем (клики, ввод текста) 
// и, самое главное, логику взаимодействия со смарт-контрактами маркетплейса и токена.
// Компонент карточки NFT, отображает информацию об NFT и кнопки действий.
// NFTCard.jsx (Карточка для NFT - ERC721/ERC1155)
import CardItem from './CardItem';

function NFTCard({ nft, classes }) { // nft - объект с данными NFT
  return (
    <CardItem
      item={{ 
        name: nft.name,
        description: nft.description,
        image: nft.image,
        creator: nft.creator, // Добавляем creator
        owner: nft.owner,       // Добавляем owner
        seller: nft.seller       // Добавляем seller
      }}
      type="nft"
      classes={classes}
    />
  );
}

export default NFTCard;




















// import CardItem from './CardItem';
// import CardAddresses from './CardAddresses'; // Предположим, что такой компонент у вас есть

// function NFTCard({ item, classes }) { // item - объект с данными NFT
//   return (
//     <CardItem
//       title={item.name}
//       description={item.description}
//       image={item.image}
//       classes={classes}
//     >
//       <CardAddresses nft={item} /> {/* Вывод адресов NFT */}
//     </CardItem>
//   );
// }

// export default NFTCard;





// import { useState, useEffect, useContext } from 'react';
// import { makeStyles } from '@mui/styles';
// import { Card, CardActions, CardContent, CardMedia, Button, Divider, Box, CircularProgress } from '@mui/material';
// import { NFTModalContext } from '../providers/NFTModalProvider';
// import { Web3Context } from '../providers/Web3Provider';
// import NFTDescription from '../atoms/NFTDescription';
// import NFTPrice from '../atoms/NFTPrice';
// import NFTName from '../atoms/NFTName';
// import CardAddresses from './CardAddresses';
// import PriceTextField from '../atoms/PriceTextField';
// import QuantityTextField from './QuantityTextField'; // Импорт компонента
// import { formatEther, parseEther } from 'viem';

// const useStyles = makeStyles({/*стили*/});

// export default function NFTCard({ nft, action, updateNFT }) {
//     const [isHovered, setIsHovered] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [listingFee, setListingFee] = useState('');
//     const [priceError, setPriceError] = useState(false);
//     const [newPrice, setPrice] = useState(0);
//     const [quantity, setQuantity] = useState(1); // Состояние для количества
//     const { name, description, image } = nft;
//     const { setModalNFT, setIsModalOpen } = useContext(NFTModalContext);
//     const { nftContract, marketplaceContract, hasWeb3 } = useContext(Web3Context);

//     useEffect(() => {
//         async function getListingFee() {
//             if (marketplaceContract) {
//                 const fee = await marketplaceContract.getListingFee();
//                 setListingFee(formatEther(fee));
//             }
//         }
//         getListingFee();
//     }, [marketplaceContract]);

//     async function buyNft(nft) { /* покупка */}
//     async function cancelNft(nft) { /* отмена */}
//     async function approveNft(nft) { /* апрув */}
//     async function sellNft(nft) {
//       //Sell NFT logic here
//     }

//     function handleCardImageClick() { /* открытие модалки */}
//     async function onClick(nft) { /* вызов метода */}

//     const handleQuantityChange = (event) => {
//       setQuantity(parseInt(event.target.value, 10) || 1); // Обновление количества
//     };


//     return (
//       /*карточка NFT*/
//           <QuantityTextField
//               value={quantity}
//               onChange={handleQuantityChange}
//               min={1}
//               disabled={isLoading}
//           />
//     );
// }