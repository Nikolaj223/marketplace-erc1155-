// Этот файл является центральным для логики получения и маппинга данных token с блокчейна для отображения на фронтенде.
//  Он занимается "преобразованием" сырых данных контракта в удобный для отображения формат.
// Этот файл является центральным для логики получения и маппинга данных token с блокчейна для отображения на фронтенде.
//  Он занимается "преобразованием" сырых данных контракта в удобный для отображения формат.

// Вспомогательная функция для объеденения mapAvailableMarketItems и getTokenMetadataByTokenId
//  Чтобы использовать в index.js
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import axios from 'axios';

/**
 * Получает метаданные токена по его ID, адресу NFT контракта и ABI.
 * @param {string} nftContractAddress Адрес NFT контракта.
 * @param {number} tokenId ID токена, для которого нужно получить метаданные.
 * @param {object} yourNFTAbi ABI NFT контракта.
 * @returns {object} Объект с метаданными токена (name, description, image).
 */
async function getTokenMetadataByTokenId(nftContractAddress, tokenId, yourNFTAbi) {
    try {
        // Создаем провайдера для подключения к сети.
        const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

        // Создаем экземпляр контракта.
        const contract = new ethers.Contract(nftContractAddress, yourNFTAbi, provider);

        // Получаем URI токена.
        const tokenUri = await contract.uri(tokenId);

        // Заменяем `{id}` на реальный tokenId в URI.
        const uri = tokenUri.replace('{id}', tokenId.toString());

        // Получаем JSON с метаданными токена по URI.
        const { data } = await axios.get(uri);

        // Возвращаем объект с метаданными.
        return {
            name: data.name || 'Unknown',
            description: data.description || 'No description',
            image: data.image || '',
        };
    } catch (error) {
        // Обрабатываем ошибки при получении метаданных.
        console.error("Ошибка при получении метаданных:", error);
        return {
            name: 'Unknown',
            description: 'Could not load metadata',
            image: '',
        };
    }
}

/**
 * Маппит доступные элементы с маркетплейса, добавляя метаданные токенов.
 * @param {object} nftContract Экземпляр NFT контракта.
 * @param {object} marketplaceContract Экземпляр контракта маркетплейса.
 * @returns {function} Функция для маппинга элементов.
 */
const mapAvailableMarketItems = (nftContract, marketplaceContract) => async (marketItem) => {
    const metadata = await getTokenMetadataByTokenId(nftContract.address, Number(marketItem.tokenId), nftContract.abi);

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

/**
 * Функция для получения уникальных ID токенов, которыми владеет пользователь или которые он создал
 * @param {object} tokenContract
 * @returns {*[]}
 */
async function getUniqueOwnedAndCreatedTokenIds(tokenContract) {
    //TODO: Реализуйте функцию для получения ID токенов.
    return []
}

/**
 * Функция для маппинга созданных и принадлежащих токенов как элементов маркетплейса
 * @param {object} marketplaceContract
 * @param {object} tokenContract
 * @param {string} account
 * @returns {{}}
 */
const mapCreatedAndOwnedTokenIdsAsMarketItems = (marketplaceContract, tokenContract, account) => async (tokenId) => {
    //TODO: Реализуйте функцию для преобразования ID токенов в элементы маркетплейса.
    return {}
};

// Экспортируем необходимые функции.
export { mapAvailableMarketItems, getTokenMetadataByTokenId, getUniqueOwnedAndCreatedTokenIds, mapCreatedAndOwnedTokenIdsAsMarketItems };

// import { readContract } from 'wagmi';
// import axios from 'axios';

// // Функция для получения метаданных токена по его ID
// async function getTokenMetadataByTokenId(nftContractAddress, tokenId, yourNFTAbi) {
//     try {
//         const tokenUri = await readContract({
//             address: nftContractAddress,
//             abi: yourNFTAbi,
//             functionName: 'uri',
//             args: [tokenId],
//         });

//         const uri = tokenUri.replace('{id}', tokenId.toString());

//         const { data } = await axios.get(uri);

//         return {
//             name: data.name || 'Unknown',
//             description: data.description || 'No description',
//             image: data.image || '',
//         };
//     } catch (error) {
//         console.error("Ошибка при получении метаданных:", error);
//         return {
//             name: 'Unknown',
//             description: 'Could not load metadata',
//             image: '',
//         };
//     }
// }

// // Функция для маппинга доступных элементов с маркетплейса, добавляет метаданные
// const mapAvailableMarketItems = (nftContract, marketplaceContract) => async (marketItem) => {
//     const metadata = await getTokenMetadataByTokenId(nftContract.address, Number(marketItem.tokenId), nftContract.abi);

//     return {
//         price: marketItem.price ? marketItem.price.toString() : undefined,
//         tokenId: Number(marketItem.tokenId),
//         marketItemId: Number(marketItem.marketItemId),
//         seller: marketItem.seller,
//         owner: marketItem.owner,
//         sold: marketItem.sold,
//         canceled: marketItem.canceled,
//         image: metadata.image,
//         name: metadata.name,
//         description: metadata.description,
//         balance: Number(marketItem.balance || 1),
//     };
// }

// // Функция для получения уникальных ID токенов, которыми владеет пользователь или которые он создал
// async function getUniqueOwnedAndCreatedTokenIds(tokenContract) {
//     //TODO: Реализуйте функцию для получения ID токенов.
//     return []
// }

// // Функция для маппинга созданных и принадлежащих токенов как элементов маркетплейса
// const mapCreatedAndOwnedTokenIdsAsMarketItems = (marketplaceContract, tokenContract, account) => async (tokenId) => {
//     //TODO: Реализуйте функцию для преобразования ID токенов в элементы маркетплейса.
//     return {}
// };

// // Экспортируем все необходимые функции
// export { mapAvailableMarketItems, getTokenMetadataByTokenId, getUniqueOwnedAndCreatedTokenIds, mapCreatedAndOwnedTokenIdsAsMarketItems };



















// import axios from 'axios';
// import { readContract } from '@wagmi/core';

// // Функция получения метаданных токена по его ID.
// async function getTokenMetadataByTokenId(nftContractAddress, tokenId, yourNFTAbi) {
//     try {
//         const tokenUri = await readContract({
//             address: nftContractAddress,
//             abi: yourNFTAbi,
//             functionName: 'uri',
//             args: [tokenId],
//         });
//         const uri = tokenUri.replace('{id}', tokenId.toString());
//         const { data } = await axios.get(uri);

//         return {
//             name: data.name || 'Unknown',
//             description: data.description || 'No description',
//             image: data.image || '',
//         };
//     } catch (error) {
//         console.error("Ошибка при получении метаданных:", error);
//         return {
//             name: 'Unknown',
//             description: 'Could not load metadata',
//             image: '',
//         };
//     }
// }

// // Функция для маппинга массива элементов с маркетплейса, добавляет метаданные.
// async function mapAvailableMarketItems(nftContractAddress, yourNFTAbi, marketItems) {
//    return Promise.all(marketItems.map(async (marketItem) => {
//         const metadata = await getTokenMetadataByTokenId(nftContractAddress, marketItem.tokenId, yourNFTAbi);
//         return mapMarketItem(marketItem, metadata);
//     }));
// }

// // Функция для маппинга отдельного элемента с маркетплейса, объединяет данные элемента и метаданные.
// function mapMarketItem(marketItem, metadata) {
//     return {
//         price: marketItem.price ? marketItem.price.toString() : undefined,
//         tokenId: Number(marketItem.tokenId),
//         marketItemId: Number(marketItem.marketItemId),
//         seller: marketItem.seller,
//         owner: marketItem.owner,
//         sold: marketItem.sold,
//         canceled: marketItem.canceled,
//         image: metadata.image,
//         name: metadata.name,
//         description: metadata.description,
//         balance: Number(marketItem.balance || 1),
//     };
// }

// export { getTokenMetadataByTokenId, mapAvailableMarketItems, mapMarketItem };























// import axios from 'axios';
// import { readContract } from '@wagmi/core';

// // Функция получения метаданных токена по его ID.
// export async function getTokenMetadataByTokenId(nftContractAddress, tokenId, yourNFTAbi) {
//     try {
//         const tokenUri = await readContract({
//             address: nftContractAddress,
//             abi: yourNFTAbi,
//             functionName: 'uri',
//             args: [tokenId],
//         });
//         const uri = tokenUri.replace('{id}', tokenId.toString());
//         const { data } = await axios.get(uri);

//         return {
//             name: data.name || 'Unknown',
//             description: data.description || 'No description',
//             image: data.image || '',
//         };
//     } catch (error) {
//         console.error("Ошибка при получении метаданных:", error);
//         return {
//             name: 'Unknown',
//             description: 'Could not load metadata',
//             image: '',
//         };
//     }
// }

// // Функция для маппинга массива элементов с маркетплейса, добавляет метаданные.
// export async function mapAvailableMarketItems(nftContractAddress, yourNFTAbi, marketItems) {
//    return Promise.all(marketItems.map(async (marketItem) => {
//         const metadata = await getTokenMetadataByTokenId(nftContractAddress, marketItem.tokenId, yourNFTAbi);
//         return mapMarketItem(marketItem, metadata);
//     }));
// }

// // Функция для маппинга отдельного элемента с маркетплейса, объединяет данные элемента и метаданные.
// export function mapMarketItem(marketItem, metadata) {
//     return {
//         price: marketItem.price ? marketItem.price.toString() : undefined,
//         tokenId: Number(marketItem.tokenId),
//         marketItemId: Number(marketItem.marketItemId),
//         seller: marketItem.seller,
//         owner: marketItem.owner,
//         sold: marketItem.sold,
//         canceled: marketItem.canceled,
//         image: metadata.image,
//         name: metadata.name,
//         description: metadata.description,
//         balance: Number(marketItem.balance || 1),
//     };
// }

// export { getTokenMetadataByTokenId, mapAvailableMarketItems, mapMarketItem };



















// import axios from 'axios';
// import { readContract } from '@wagmi/core';

// // Функция получения метаданных токена по его ID.  Принимает адрес контракта NFT.
// export async function getTokenMetadataByTokenId(nftContractAddress, tokenId, yourNFTAbi) {
//     try {
//         // Получаем URI метаданных токена из контракта.
//         const tokenUri = await readContract({
//             address: nftContractAddress,
//             abi: yourNFTAbi, // Используем переданный ABI
//             functionName: 'uri',
//             args: [tokenId],
//         });

//         // Заменяем '{id}' на фактический tokenId в URI.
//         const uri = tokenUri.replace('{id}', tokenId.toString());

//         // Получаем JSON метаданные по URI.
//         const { data } = await axios.get(uri);

//         return {
//             name: data.name || 'Unknown',
//             description: data.description || 'No description',
//             image: data.image || '',
//         };
//     } catch (error) {
//         console.error("Ошибка при получении метаданных:", error);
//         return {
//             name: 'Unknown',
//             description: 'Could not load metadata',
//             image: '',
//         };
//     }
// }

// // Функция для маппинга массива элементов с маркетплейса, добавляет метаданные. Принимает адрес и ABI контракта.
// export function mapAvailableMarketItems(nftContractAddress, yourNFTAbi) {
//     return async (marketItem) => {
//         const metadata = await getTokenMetadataByTokenId(nftContractAddress, marketItem.tokenId, yourNFTAbi); // Передаем ABI
//         return mapMarketItem(marketItem, metadata);
//     };
// }

// // Функция для маппинга отдельного элемента с маркетплейса, объединяет данные элемента и метаданные.
// export function mapMarketItem(marketItem, metadata) {
//     return {
//         price: marketItem.price ? marketItem.price.toString() : undefined,
//         tokenId: Number(marketItem.tokenId),
//         marketItemId: Number(marketItem.marketItemId),
//         seller: marketItem.seller,
//         owner: marketItem.owner,
//         sold: marketItem.sold,
//         canceled: marketItem.canceled,
//         image: metadata.image,
//         name: metadata.name,
//         description: metadata.description,
//         balance: Number(marketItem.balance || 1),
//     };
// }



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