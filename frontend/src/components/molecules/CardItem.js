// import { Card, CardMedia, CardContent, Typography } from '@mui/material';
// import { makeStyles } from '@mui/styles'; // Импорт для стилей
// import CardAddresses from './CardAddresses';
// import { useContext, useEffect, useState } from 'react'
//  import { Card, CardActions, CardContent, CardMedia, Button, Divider, Box, CircularProgress } from '@mui/material'
//  import { TokenModalContext } from '../providers/TokenModalProvider'
// import { Web3Context } from '../providers/Web3Provider'
// import TokenDescription from '../atoms/TokenDescription'
// import TokenPrice from '../atoms/TokenPrice'
// import TokenName from '../atoms/TokenName'
// import CardAddresses from './CardAddresses'
// import PriceTextField from '../atoms/PriceTextField'
// import QuantityTextField from '../atoms/QuantityTextField'

import { styled } from '@mui/material/styles'; // Исправлен импорт стилей
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import CardAddresses from './CardAddresses';
import TokenDescription from '../atoms/TokenDescription';
import TokenPrice from '../atoms/TokenPrice';
import TokenName from '../atoms/TokenName';
import QuantityTextField from '../atoms/QuantityTextField';
import PriceTextField from '../atoms/PriceTextField';
import { useState, useContext } from 'react';
import { Web3Context } from '../providers/Web3Provider';
import { usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi';
import { NFTModalContext } from '../providers/TokenModalProvider';
import { useForm } from 'react-hook-form'; // Добавлен импорт useForm

// Убрали makeStyles, используем styled-components или styled из MUI
const CardContainer = styled(Card)(({ theme }) => ({
  // Стили
  flexDirection: 'column',
  display: 'flex',
  margin: '15px',
  flexGrow: 1,
  maxWidth: 345,
}));

const Media = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
  cursor: 'pointer',
});

const Content = styled(CardContent)({
  paddingBottom: '8px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

function CardItem({ item, type, contractAddress, contractABI, listingFeeFunctionName = 'getListingFee' }) {
  const { account } = useContext(Web3Context);
  const { setIsModalOpen, setModalNFT } = useContext(NFTModalContext);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);


  const { config: buyConfig } = usePrepareContractWrite({ address: contractAddress, abi: contractABI, functionName: 'buyToken', args: [item.tokenId, quantity], value: type === 'erc20' ? price : 0 });
  const { write: buy, isLoading: isBuyLoading, isError: isBuyError } = useContractWrite(buyConfig);

  const { config: listConfig } = usePrepareContractWrite({ address: contractAddress, abi: contractABI, functionName: 'listItem', args: [item.tokenId, price] });
  const { write: list, isLoading: isListLoading, isError: isListError } = useContractWrite(listConfig);

  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);

  const renderERC20 = () => (
    <>
      <TokenName name={item.name} />
      <Typography>Balance: {item.balance}</Typography>
      <PriceTextField value={price} onChange={handlePriceChange} />
      <QuantityTextField value={quantity} onChange={handleQuantityChange} />
      <Button disabled={!buy || isBuyLoading} onClick={() => buy?.()}>{isBuyLoading ? 'Buying...' : 'Buy'}</Button>
    </>
  );

  const renderNFT = () => (
    <>
      {item.image && <Media image={item.image} title={item.name} />}
      <TokenName name={item.name} />
      <TokenDescription description={item.description} />
      <TokenPrice price={item.price} />
      <PriceTextField value={price} onChange={handlePriceChange} />
      <QuantityTextField value={quantity} onChange={handleQuantityChange} />

      <Button disabled={!buy || isBuyLoading} onClick={() => buy?.()}>{isBuyLoading ? 'Buying...' : 'Buy'}</Button>

      {account === item.owner && (
        <>
          Listing Fee: {'fee'}
          <Button disabled={!list || isListLoading} onClick={() => list?.()}>{isListLoading ? 'Listing...' : 'List'}</Button>
        </>
      )}

      {isBuyError && <Typography color="error">Error buying token</Typography>}
      {isListError && <Typography color="error">Error listing token</Typography>}

    </>
  );

  return (
    <CardContainer>
      <Content>
        {type === 'erc20' ? renderERC20() : renderNFT()}
        <CardAddresses item={item} type={type} />
      </Content>
    </CardContainer>
  );
}

export default CardItem;





// // function CardItem({ item, type }) {
// function CardItem({ item, type }) {
//   const { account } = useContext(Web3Context); // Используем Web3Context для доступа к account
//   const { setIsModalOpen, setModalNFT } = useContext(NFTModalContext); // Используем NFTModalContext
//   const classes = useStyles();
//   const [quantity, setQuantity] = useState(1);
//   const [price, setPrice] = useState(0);

//   const handleQuantityChange = (event) => {
//     setQuantity(event.target.value);
//   };

//   const handlePriceChange = (event) => {
//     setPrice(event.target.value);
//   };

//   const renderERC20 = () => (
//     <>
//       <TokenName name={item.name} />
//       <PriceTextField label="Цена" value={price} onChange={handlePriceChange} />
//       <QuantityTextField value={quantity} onChange={handleQuantityChange} />
//     </>
//   );

//   const renderNFT = () => (
//     <>
//       {item.image && <CardMedia className={classes.media} image={item.image} title={item.name} />}
//       <TokenName name={item.name} />
//       <TokenDescription description={item.description} />
//       <TokenPrice price={item.price} />
//       <PriceTextField label="Цена" value={price} onChange={handlePriceChange} />
//       <QuantityTextField value={quantity} onChange={handleQuantityChange} />
//     </>
//   );

//   return (
//     <Card className={classes.root}>
//       <CardContent className={classes.cardContent}>
//         {type === 'erc20' && renderERC20()}
//         {type === 'nft' && renderNFT()}
//         <CardAddresses item={item} type={type} />
//       </CardContent>
//     </Card>
//   );
// }

// export default CardItem;








// const useStyles = makeStyles({ // Стили
//   root: {
//     flexDirection: 'column',
//     display: 'flex',
//     margin: '15px',
//     flexGrow: 1,
//     maxWidth: 345,
//   },
//   media: {
//     height: 0,
//     paddingTop: '56.25%',
//     cursor: 'pointer',
//   },
//   cardContent: {
//     paddingBottom: '8px',
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100%',
//   },
// });

// function CardItem({ item, type }) {
//   const classes = useStyles(); // Использование стилей

//   const renderERC20 = () => (
//     <>
//       <Typography variant="h6">{item.name}</Typography>
//       <Typography>Balance: {item.balance}</Typography>
//     </>
//   );

//   const renderNFT = () => (
//     <>
//       {item.image && <CardMedia className={classes.media} image={item.image} title={item.name} />}
//       <Typography variant="h6">{item.name}</Typography>
//       <Typography>{item.description}</Typography>
//       {/* <NFTDescription description={item.description} /> - если импортировали NFTDescription */}
//     </>
//   );

//   return (
//     <Card className={classes.root}>
//       <CardContent className={classes.cardContent}>
//         {type === 'erc20' && renderERC20()}
//         {type === 'nft' && renderNFT()}
//         <CardAddresses item={item} type={type} />
//       </CardContent>
//     </Card>
//   );
// }

// export default CardItem;











// import { Card, CardMedia, CardContent, Typography } from '@mui/material';
// import CardAddresses from './CardAddresses';

// function CardItem({ item, type, classes }) {
//   // Используем деструктуризацию, чтобы получить данные из объекта item

//   // Функция отображения контента для ERC20 токена
//   const renderERC20 = () => (
//     <>
//       <Typography variant="h6">{item.name}</Typography>
//       <Typography>Balance: {item.balance}</Typography>
//       {/* Дополнительный контент для ERC20 */}
//     </>
//   );

//   // Функция отображения контента для NFT
//   const renderNFT = () => (
//     <>
//       {item.image && <CardMedia className={classes.media} image={item.image} title={item.name} />}
//       <Typography variant="h6">{item.name}</Typography>
//       <Typography>{item.description}</Typography>
//       {/* Дополнительный контент для NFT */}
//     </>
//   );

// return (
//     <Card className={classes.root}>
//       <CardContent>
//         {/* Условный рендеринг контента в зависимости от типа */}
//         {type === 'erc20' && renderERC20()}
//         {type === 'nft' && renderNFT()}

//         {/* Отображение адресов */}
//         <CardAddresses item={item} type={type} />
//       </CardContent>
//     </Card>
//   );
// }

// export default CardItem;