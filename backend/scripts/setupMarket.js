const hre = require('hardhat');

// Функции получения информации о событиях (без изменений)
async function getMintedTokenInfo(transaction) { /* ... */ }
async function getCreatedMarketItemInfo(transaction) { /* ... */ }

async function setupMarket(marketplaceAddress, nftAddress) {
    // Получение контрактов и аккаунтов (без изменений)
    const networkName = hre.network.name.toUpperCase();
    marketplaceAddress = marketplaceAddress || process.env[`MARKETPLACE_CONTRACT_ADDRESS_${networkName}`];
    nftAddress = nftAddress || process.env[`NFT_CONTRACT_ADDRESS_${networkName}`];

    const marketplaceContract = await hre.ethers.getContractAt('Marketplace1155', marketplaceAddress);
    const nftContract = await hre.ethers.getContractAt('MyERC1155NFT', nftAddress);
    const nftContractAddress = nftContract.address;
    const [acc1, acc2] = await hre.ethers.getSigners();

    const price = hre.ethers.utils.parseEther('0.01');
    const listingFee = await marketplaceContract.getListingFee();

    const mintAmount = 100;
    const tokenId = 1; // Пример ID токена

    // Минт, апрув, создание маркет-айтема (без изменений)
    const mintTx = await nftContract.mint(acc1.address, tokenId, mintAmount, '0x');
    const mintedInfo = await getMintedTokenInfo(mintTx);
    console.log(`${acc1.address} minted ${mintedInfo.amount} of token ID: ${mintedInfo.id}`);

    await nftContract.setApprovalForAll(marketplaceContract.address, true);

    const listAmount = 50;
    const createTx =  await marketplaceContract.createMarketItem(nftContractAddress, tokenId, listAmount, price, { value: listingFee });
    const marketItemInfo = await getCreatedMarketItemInfo(createTx);
    console.log(`${acc1.address} listed ${listAmount} of token ${tokenId} as market item`);
    const marketItemId = marketItemInfo.marketItemId;

    // Покупка токена acc2
    await marketplaceContract.connect(acc2).createMarketSale(nftContractAddress, tokenId, listAmount, { value: price });
    console.log(`${acc2.address} bought ${listAmount} of token ${tokenId}`);

    // Отмена листинга (acc1 отменяет свой листинг) - если такая функция есть
    // await marketplaceContract.cancelMarketItem(nftContractAddress, marketItemId);
    // console.log(`${acc1.address} canceled market item ${marketItemId}`);

    // Перепродажа токена acc2
    await nftContract.connect(acc2).setApprovalForAll(marketplaceContract.address, true);
    await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, tokenId, listAmount, price, { value: listingFee });
    console.log(`${acc2.address} relisted ${listAmount} of token ${tokenId} for sale`);
}

module.exports = {
    setupMarket,
    getMintedTokenInfo,
    getCreatedMarketItemInfo
};





























// const hre = require('hardhat');

// // Функция для получения ID и количества отчеканенных токенов ERC1155
// async function getMintedTokenInfo(transaction) {
//     const transactionResult = await transaction.wait();
//     const event = transactionResult.events.find(e => e.event === 'TransferSingle'); // Ищем событие TransferSingle
//     const id = event.args[3];
//     const amount = event.args[4];
//     return { id: id.toNumber(), amount: amount.toNumber() };
// }

// // Функция для получения информации о созданном маркет-айтеме (ID, tokenId, amount)
// async function getCreatedMarketItemInfo (transaction) {
//     const transactionResult = await transaction.wait();
//     const marketItemEvent = transactionResult.events.find(event => event.event === 'MarketItemCreated'); // Ищем событие MarketItemCreated
//     if (!marketItemEvent) throw new Error("MarketItemCreated event not found");

//     const marketItemId = marketItemEvent.args[0];
//     const tokenId = marketItemEvent.args[1];
//     const amount = marketItemEvent.args[2];
//     return { marketItemId: marketItemId.toNumber(), tokenId: tokenId.toNumber(), amount: amount.toNumber() };
// }

// // Настройка маркетплейса: минт токенов, апрув, создание маркет-айтема
// async function setupMarket(marketplaceAddress, nftAddress) {
//     const networkName = hre.network.name.toUpperCase();
//     marketplaceAddress = marketplaceAddress || process.env[`MARKETPLACE_CONTRACT_ADDRESS_${networkName}`];
//     nftAddress = nftAddress || process.env[`NFT_CONTRACT_ADDRESS_${networkName}`];

//     const marketplaceContract = await hre.ethers.getContractAt('Marketplace1155', marketplaceAddress); // Получаем instance контракта маркетплейса
//     const nftContract = await hre.ethers.getContractAt('MyERC1155NFT', nftAddress); // Получаем instance контракта NFT
//     const nftContractAddress = nftContract.address;
//     const [acc1, acc2] = await hre.ethers.getSigners();

//     const price = hre.ethers.utils.parseEther('0.01');
//     const listingFee = await marketplaceContract.getListingFee();

//     const mintAmount = 100; // Количество токенов для чеканки
//     const tokenId = 1; // Пример ID токена
//     const mintTx = await nftContract.mint(acc1.address, tokenId, mintAmount, '0x'); // Минтим токены
//     const mintedInfo = await getMintedTokenInfo(mintTx);  // Получаем информацию о минте из события
//     console.log(`${acc1.address} minted ${mintedInfo.amount} of token ID: ${mintedInfo.id}`);

//     await nftContract.setApprovalForAll(marketplaceContract.address, true); // Апрувим маркетплейс для управления токенами

//     const listAmount = 50; // Количество выставляемых на продажу токенов
//     await marketplaceContract.createMarketItem(nftContractAddress, tokenId, listAmount, price, { value: listingFee });  // Создаем маркет-айтем
//     console.log(`${acc1.address} listed ${listAmount} of token ${tokenId} as market item`);
// }

// module.exports = {
//     setupMarket,
//     getMintedTokenInfo,
//     getCreatedMarketItemInfo
// };



















// const hre = require('hardhat');

// //Адаптированная функция для получения ID и количества отчеканенных токенов ERC1155
// async function getMintedTokenInfo(transaction) {
//     const transactionResult = await transaction.wait();
//     const event = transactionResult.events.find(e => e.event === 'TransferSingle'); //Изменено
//     const id = event.args[3];
//     const amount = event.args[4];
//     return { id: id.toNumber(), amount: amount.toNumber() };
// }

// async function getCreatedMarketItemInfo (transaction) {
//   const transactionResult = await transaction.wait();
//   const marketItemEvent = transactionResult.events.find(event => event.event === 'MarketItemCreated');
//   if (!marketItemEvent) throw new Error("MarketItemCreated event not found");

//   const marketItemId = marketItemEvent.args[0];
//   const tokenId = marketItemEvent.args[1];
//   const amount = marketItemEvent.args[2];
//   return { marketItemId: marketItemId.toNumber(), tokenId: tokenId.toNumber(), amount: amount.toNumber() };
// }

// async function setupMarket(marketplaceAddress, nftAddress) {
//     const networkName = hre.network.name.toUpperCase();
//     marketplaceAddress = marketplaceAddress || process.env[`MARKETPLACE_CONTRACT_ADDRESS_${networkName}`];
//     nftAddress = nftAddress || process.env[`NFT_CONTRACT_ADDRESS_${networkName}`];

//     const marketplaceContract = await hre.ethers.getContractAt('Marketplace1155', marketplaceAddress); // Укажи имя твоего контракта
//     const nftContract = await hre.ethers.getContractAt('MyERC1155NFT', nftAddress); // Укажи имя твоего контракта
//     const nftContractAddress = nftContract.address;
//     const [acc1, acc2] = await hre.ethers.getSigners();

//     const price = hre.ethers.utils.parseEther('0.01');
//     const listingFee = await marketplaceContract.getListingFee();

//     const mintAmount = 100; // Количество токенов для чеканки
//     const tokenId = 1; // Пример ID токена
//     const mintTx = await nftContract.mint(acc1.address, tokenId, mintAmount, '0x'); // Используем mint с количеством
//     const mintedInfo = await getMintedTokenInfo(mintTx);  // Извлекаем ID и кол-во из события
//     console.log(`${acc1.address} minted ${mintedInfo.amount} of token ID: ${mintedInfo.id}`);

//     await nftContract.setApprovalForAll(marketplaceContract.address, true); // Требуется Approval для ERC1155

//     const listAmount = 50;
//     await marketplaceContract.createMarketItem(nftContractAddress, tokenId, listAmount, price, { value: listingFee });  // Создаем MarketItem
//     console.log(`${acc1.address} listed ${listAmount} of token ${tokenId} as market item`);
// }














// const hre = require('hardhat')

// const dogsMetadataUrl = 'https://ipfs.io/ipfs/Qma1wY9HLfdWbRr1tDPpVCfbtPPvjnai1rEukuqSxk6PWb?filename=undefined'
// const techEventMetadataUrl = 'https://ipfs.io/ipfs/QmchRqWmRiHP2uXBGxT7sJJUJChDddHpyApoH94S3VkH42?filename=undefined'
// const yellowCrownMetadataUrl = 'https://ipfs.io/ipfs/QmVXBCJcDtgtZfx77W86iG5hrJnFjWz1HV7naHAJMArqNT?filename=undefined'
// const ashleyMetadataUrl = 'https://ipfs.io/ipfs/QmdiA6eywkjMAVGTYRXerSQozLEBA3QpKmAt1E1mKVovhz?filename=undefined'
// const codeconMetadataUrl = 'https://ipfs.io/ipfs/QmdMbGwGLmC5iNmv1hzRvJQpzrKmKfHjbB34k4e8AfqKay?filename=Codecon%20Tech%20Event'
// const webArMetadataUrl = 'https://ipfs.io/ipfs/QmSzFfx3rNqdJwSsrFpfMcxZCncaATsCceaFEr6Lmq3VUz?filename=Showing%20off%20WebAR'

// // Адаптируем для ERC1155 TransferSingle event
// async function getMintedTokenInfo (transaction) {
//   const transactionResult = await transaction.wait();
//   const event = transactionResult.events.find(e => e.event === 'TransferSingle' || e.event === 'TransferBatch');
//   if (!event) throw new Error("No TransferSingle/Batch event found");

//   if (event.event === 'TransferSingle') {
//     const id = event.args[3];
//     const amount = event.args[4];
//     return { id: id.toNumber(), amount: amount.toNumber() };
//   } else {
//     throw new Error("TransferBatch not yet supported by getMintedTokenInfo");
//   }
// }

// async function getCreatedMarketItemInfo (transaction) {
//   const transactionResult = await transaction.wait();
//   const marketItemEvent = transactionResult.events.find(event => event.event === 'MarketItemCreated');
//   if (!marketItemEvent) throw new Error("MarketItemCreated event not found");

//   const marketItemId = marketItemEvent.args[0];
//   const tokenId = marketItemEvent.args[1];
//   const amount = marketItemEvent.args[2];
//   return { marketItemId: marketItemId.toNumber(), tokenId: tokenId.toNumber(), amount: amount.toNumber() };
// }

// async function setupMarket (marketplaceAddress, nftAddress) {
//   const networkName = hre.network.name.toUpperCase();
//   marketplaceAddress = marketplaceAddress || process.env[`MARKETPLACE_CONTRACT_ADDRESS_${networkName}`];
//   nftAddress = nftAddress || process.env[`NFT_CONTRACT_ADDRESS_${networkName}`];

//   const marketplaceContract = await hre.ethers.getContractAt('Marketplace1155', marketplaceAddress);
//   const nftContract = await hre.ethers.getContractAt('MyERC1155NFT', nftAddress);
//   const nftContractAddress = nftContract.address;
//   const [acc1, acc2] = await hre.ethers.getSigners();

//   const price = hre.ethers.utils.parseEther('0.01');
//   const listingFee = await marketplaceContract.getListingFee();

//   const mintAmount = 100;
//   const dogsTokenId = 1;
//   const techEventTokenId = 2;
//   const codeconTokenId = 3;
//   const webArTokenId = 4;

//   await nftContract.mint(acc1.address, dogsTokenId, mintAmount, '0x');
//   await nftContract.mint(acc1.address, techEventTokenId, mintAmount, '0x');
//   await nftContract.mint(acc1.address, codeconTokenId, mintAmount, '0x');
//   await nftContract.mint(acc1.address, webArTokenId, mintAmount, '0x');
//   console.log(`${acc1.address} minted ${mintAmount} of each token IDs: ${dogsTokenId}, ${techEventTokenId}, ${codeconTokenId}, ${webArTokenId}`);

//   await nftContract.setApprovalForAll(marketplaceContract.address, true);
//   console.log(`${acc1.address} approved marketplace for all their ERC1155 tokens`);

//   const listAmount = 50;
//   await marketplaceContract.createMarketItem(nftContractAddress, dogsTokenId, listAmount, price, { value: listingFee });
//   await marketplaceContract.createMarketItem(nftContractAddress, techEventTokenId, listAmount, price, { value: listingFee });
//   const codeconMarketTx = await marketplaceContract.createMarketItem(nftContractAddress, codeconTokenId, listAmount, price, { value: listingFee });
//   const { marketItemId: codeconMarketItemId } = await getCreatedMarketItemInfo(codeconMarketTx);
//   await marketplaceContract.createMarketItem(nftContractAddress, webArTokenId, listAmount, price, { value: listingFee });
//   console.log(`${acc1.address} listed ${listAmount} of tokens ${dogsTokenId}, ${techEventTokenId}, ${codeconTokenId} and ${webArTokenId} as market items`);

//   await marketplaceContract.cancelMarketItem(codeconMarketItemId);
//   console.log(`${acc1.address} canceled market item for token ${codeconTokenId} (Market Item ID: ${codeconMarketItemId})`);

//   const yellowTokenId = 5;
//   const ashleyTokenId = 6;

//   await nftContract.connect(acc2).mint(acc2.address, yellowTokenId, mintAmount, '0x');
//   await nftContract.connect(acc2).mint(acc2.address, ashleyTokenId, mintAmount, '0x');
//   console.log(`${acc2.address} minted ${mintAmount} of each token IDs: ${yellowTokenId}, ${ashleyTokenId}`);

//   await nftContract.connect(acc2).setApprovalForAll(marketplaceContract.address, true);
//   console.log(`${acc2.address} approved marketplace for all their ERC1155 tokens`);

//   await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, yellowTokenId, listAmount, price, { value: listingFee });
//   await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, ashleyTokenId, listAmount, price, { value: listingFee });
//   console.log(`${acc2.address} listed ${listAmount} of tokens ${yellowTokenId} and ${ashleyTokenId} as market items`);
// }


// Этот скрипт нужен для первоначальной настройки маркетплейса после его развертывания. Он выполняет следующие действия:
// Минтит токены ERC1155 на аккаунты acc1 и acc2 (можно их изменить в коде)
// Устанавливает разрешение (approval) для маркетплейса на управление этими токенами
// Создает элементы маркетплейса (listing) с этими токенами
// Отменяет один из элементов маркетплейса (для демонстрации работы функции отмены)
// Для работы скрипту требуются адреса развернутых контрактов маркетплейса и NFT. Эти адреса берутся из переменных окружения, например, MARKETPLACE_CONTRACT_ADDRESS_${networkName}.
// В .env backend должны быть определены MARKETPLACE_CONTRACT_ADDRESS_SEPOLIA и NFT_CONTRACT_ADDRESS_SEPOLIA (если вы используете Sepolia).