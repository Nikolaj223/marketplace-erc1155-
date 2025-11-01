import { styled } from '@mui/material/styles';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import CardAddresses from './CardAddresses';
import TokenDescription from '../atoms/TokenDescription';
import TokenPrice from '../atoms/TokenPrice';
import TokenName from '../atoms/TokenName';
import QuantityTextField from '../atoms/QuantityTextField';
import PriceTextField from '../atoms/PriceTextField';
import { useState, useContext, useEffect } from 'react';
import { Web3Context } from '../providers/Web3Provider';
import { NFTModalContext } from '../providers/TokenModalProvider';
import { ethers } from 'ethers';

const CardContainer = styled(Card)(({ theme }) => ({ /* стили */ }));
const Media = styled(CardMedia)({/* стили */});
const Content = styled(CardContent)({/* стили */});

function CardItem({ item, type, contractAddress, contractABI, listingFeeFunctionName = 'getListingFee' }) {
  const { account } = useContext(Web3Context);
  const { setIsModalOpen, setModalNFT } = useContext(NFTModalContext);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [buyError, setBuyError] = useState(null);
  const [listError, setListError] = useState(null);

  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);

  const buyToken = async () => {
    setIsBuyLoading(true);
    setBuyError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.buyToken(item.tokenId, quantity, { value: type === 'erc20' ? price : 0 });
      await tx.wait();
      console.log("Куплено успешно");
    } catch (error) {
      console.error("Ошибка при покупке:", error);
      setBuyError("Ошибка покупки");
    } finally {
      setIsBuyLoading(false);
    }
  };

  const listItem = async () => {
    setIsListLoading(true);
    setListError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.listItem(item.tokenId, price);
      await tx.wait();
      console.log("Выставлено на продажу успешно");
    } catch (error) {
      console.error("Ошибка при выставлении на продажу:", error);
      setListError("Ошибка выставления на продажу");
    } finally {
      setIsListLoading(false);
    }
  };

  const renderERC20 = () => (<>{/* ERC20 UI */}</>);
  const renderNFT = () => (<>{/* NFT UI */}</>);

  return (
    <CardContainer><Content>
      {type === 'erc20' ? renderERC20() : renderNFT()}
      <CardAddresses item={item} type={type} />
    </Content></CardContainer>
  );
}

export default CardItem;

// import { styled } from '@mui/material/styles'; // Исправлен импорт стилей
// import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
// import CardAddresses from './CardAddresses';
// import TokenDescription from '../atoms/TokenDescription';
// import TokenPrice from '../atoms/TokenPrice';
// import TokenName from '../atoms/TokenName';
// import QuantityTextField from '../atoms/QuantityTextField';
// import PriceTextField from '../atoms/PriceTextField';
// import { useState, useContext } from 'react';
// import { Web3Context } from '../providers/Web3Provider';
// // import { /* useContractRead, useContractWrite убираешь если не используешь*/ } from 'wagmi';
// // import { usePrepareContractWrite } from 'wagmi'; // Исправленный импорт
// import { NFTModalContext } from '../providers/TokenModalProvider';
// import { useForm } from 'react-hook-form'; // Добавлен импорт useForm
// import { usePrepareContractWrite, useNetwork } from 'wagmi';

// // Убрали makeStyles, используем styled-components или styled из MUI
// const CardContainer = styled(Card)(({ theme }) => ({
//   // Стили
//   flexDirection: 'column',
//   display: 'flex',
//   margin: '15px',
//   flexGrow: 1,
//   maxWidth: 345,
// }));

// const Media = styled(CardMedia)({
//   height: 0,
//   paddingTop: '56.25%',
//   cursor: 'pointer',
// });

// const Content = styled(CardContent)({
//   paddingBottom: '8px',
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100%',
// });

// function CardItem({ item, type, contractAddress, contractABI, listingFeeFunctionName = 'getListingFee' }) {
//   const { account } = useContext(Web3Context);
//   const { setIsModalOpen, setModalNFT } = useContext(NFTModalContext);

//   const [quantity, setQuantity] = useState(1);
//   const [price, setPrice] = useState(0);


//   const { config: buyConfig } = usePrepareContractWrite({ address: contractAddress, abi: contractABI, functionName: 'buyToken', args: [item.tokenId, quantity], value: type === 'erc20' ? price : 0 });
//   const { write: buy, isLoading: isBuyLoading, isError: isBuyError } = useContractWrite(buyConfig);

//   const { config: listConfig } = usePrepareContractWrite({ address: contractAddress, abi: contractABI, functionName: 'listItem', args: [item.tokenId, price] });
//   const { write: list, isLoading: isListLoading, isError: isListError } = useContractWrite(listConfig);

//   const handleQuantityChange = (e) => setQuantity(e.target.value);
//   const handlePriceChange = (e) => setPrice(e.target.value);

//   const renderERC20 = () => (
//     <>
//       <TokenName name={item.name} />
//       <Typography>Balance: {item.balance}</Typography>
//       <PriceTextField value={price} onChange={handlePriceChange} />
//       <QuantityTextField value={quantity} onChange={handleQuantityChange} />
//       <Button disabled={!buy || isBuyLoading} onClick={() => buy?.()}>{isBuyLoading ? 'Buying...' : 'Buy'}</Button>
//     </>
//   );

//   const renderNFT = () => (
//     <>
//       {item.image && <Media image={item.image} title={item.name} />}
//       <TokenName name={item.name} />
//       <TokenDescription description={item.description} />
//       <TokenPrice price={item.price} />
//       <PriceTextField value={price} onChange={handlePriceChange} />
//       <QuantityTextField value={quantity} onChange={handleQuantityChange} />

//       <Button disabled={!buy || isBuyLoading} onClick={() => buy?.()}>{isBuyLoading ? 'Buying...' : 'Buy'}</Button>

//       {account === item.owner && (
//         <>
//           Listing Fee: {'fee'}
//           <Button disabled={!list || isListLoading} onClick={() => list?.()}>{isListLoading ? 'Listing...' : 'List'}</Button>
//         </>
//       )}

//       {isBuyError && <Typography color="error">Error buying token</Typography>}
//       {isListError && <Typography color="error">Error listing token</Typography>}

//     </>
//   );

//   return (
//     <CardContainer>
//       <Content>
//         {type === 'erc20' ? renderERC20() : renderNFT()}
//         <CardAddresses item={item} type={type} />
//       </Content>
//     </CardContainer>
//   );
// }

// export default CardItem;





