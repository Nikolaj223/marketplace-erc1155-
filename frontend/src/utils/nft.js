// Этот файл является центральным для логики получения и маппинга данных NFT с блокчейна для отображения на фронтенде.
//  Он занимается "преобразованием" сырых данных контракта в удобный для отображения формат.
import axios from 'axios'
import { ethers } from 'ethers'

export async function getTokenMetadataByTokenId(nftContract, tokenId) {
  try {
    const tokenUri = await nftContract.uri(tokenId); // Используем uri() для ERC1155
    const uri = tokenUri.replace('{id}', tokenId); // ERC-1155 uri может требовать подстановки tokenId
    const { data: metadata } = await axios.get(uri);
    return metadata;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { // Возвращаем дефолтный объект, если не удалось получить метаданные
      name: 'Unknown',
      description: 'Could not load metadata',
      image: '' // Добавляем image, чтобы не было ошибок в компонентах
    };
  }
}

export function mapAvailableMarketItems(nftContract) {
  return async (marketItem) => {
    const metadata = await getTokenMetadataByTokenId(nftContract, marketItem.tokenId);
    return mapMarketItem(marketItem, metadata);
  };
}

export function mapMarketItem(marketItem, metadata) {
  //Добавляем balance
  return {
    price: marketItem.price ? ethers.utils.formatUnits(marketItem.price, 'ether') : undefined,
    tokenId: marketItem.tokenId,
    marketItemId: marketItem.marketItemId,
    seller: marketItem.seller,
    owner: marketItem.owner,
    sold: marketItem.sold,
    canceled: marketItem.canceled,
    image: metadata.image,
    name: metadata.name,
    description: metadata.description,
    balance: marketItem.balance || 1 // Default to 1 if balance isn't specified
  };
}