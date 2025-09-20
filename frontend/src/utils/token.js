// Этот файл является центральным для логики получения и маппинга данных token с блокчейна для отображения на фронтенде.
//  Он занимается "преобразованием" сырых данных контракта в удобный для отображения формат.
import axios from 'axios';
import { readContract } from '@wagmi/core';

// Функция получения метаданных токена по его ID.  Принимает адрес контракта NFT.
export async function getTokenMetadataByTokenId(nftContractAddress, tokenId, yourNFTAbi) {
    try {
        // Получаем URI метаданных токена из контракта.
        const tokenUri = await readContract({
            address: nftContractAddress,
            abi: yourNFTAbi, // Используем переданный ABI
            functionName: 'uri',
            args: [tokenId],
        });

        // Заменяем '{id}' на фактический tokenId в URI.
        const uri = tokenUri.replace('{id}', tokenId.toString());

        // Получаем JSON метаданные по URI.
        const { data } = await axios.get(uri);

        return {
            name: data.name || 'Unknown',
            description: data.description || 'No description',
            image: data.image || '',
        };
    } catch (error) {
        console.error("Ошибка при получении метаданных:", error);
        return {
            name: 'Unknown',
            description: 'Could not load metadata',
            image: '',
        };
    }
}

// Функция для маппинга массива элементов с маркетплейса, добавляет метаданные. Принимает адрес и ABI контракта.
export function mapAvailableMarketItems(nftContractAddress, yourNFTAbi) {
    return async (marketItem) => {
        const metadata = await getTokenMetadataByTokenId(nftContractAddress, marketItem.tokenId, yourNFTAbi); // Передаем ABI
        return mapMarketItem(marketItem, metadata);
    };
}

// Функция для маппинга отдельного элемента с маркетплейса, объединяет данные элемента и метаданные.
export function mapMarketItem(marketItem, metadata) {
    return {
        price: marketItem.price ? marketItem.price.toString() : undefined,
        tokenId: Number(marketItem.tokenId),
        marketItemId: Number(marketItem.marketItemId),
        seller: marketItem.seller,
        owner: marketItem.owner,
        sold: marketItem.sold,
        canceled: marketItem.canceled,
        image: metadata.image,
        name: metadata.name,
        description: metadata.description,
        balance: Number(marketItem.balance || 1),
    };
}



// import axios from 'axios'
// import { ethers } from 'ethers'

// export async function getTokenMetadataByTokenId(nftContract, tokenId) {
//   try {
//     const tokenUri = await nftContract.uri(tokenId); // Используем uri() для ERC1155
//     const uri = tokenUri.replace('{id}', tokenId); // ERC-1155 uri может требовать подстановки tokenId
//     const { data: metadata } = await axios.get(uri);
//     return metadata;
//   } catch (error) {
//     console.error("Error fetching metadata:", error);
//     return { // Возвращаем дефолтный объект, если не удалось получить метаданные
//       name: 'Unknown',
//       description: 'Could not load metadata',
//       image: '' // Добавляем image, чтобы не было ошибок в компонентах
//     };
//   }
// }

// export function mapAvailableMarketItems(nftContract) {
//   return async (marketItem) => {
//     const metadata = await getTokenMetadataByTokenId(nftContract, marketItem.tokenId);
//     return mapMarketItem(marketItem, metadata);
//   };
// }

// export function mapMarketItem(marketItem, metadata) {
//   //Добавляем balance
//   return {
//     price: marketItem.price ? ethers.utils.formatUnits(marketItem.price, 'ether') : undefined,
//     tokenId: marketItem.tokenId,
//     marketItemId: marketItem.marketItemId,
//     seller: marketItem.seller,
//     owner: marketItem.owner,
//     sold: marketItem.sold,
//     canceled: marketItem.canceled,
//     image: metadata.image,
//     name: metadata.name,
//     description: metadata.description,
//     balance: marketItem.balance || 1 // Default to 1 if balance isn't specified
//   };
// }