const hre = require('hardhat')

const dogsMetadataUrl = 'https://ipfs.io/ipfs/Qma1wY9HLfdWbRr1tDPpVCfbtPPvjnai1rEukuqSxk6PWb?filename=undefined'
const techEventMetadataUrl = 'https://ipfs.io/ipfs/QmchRqWmRiHP2uXBGxT7sJJUJChDddHpyApoH94S3VkH42?filename=undefined'
const yellowCrownMetadataUrl = 'https://ipfs.io/ipfs/QmVXBCJcDtgtZfx77W86iG5hrJnFjWz1HV7naHAJMArqNT?filename=undefined'
const ashleyMetadataUrl = 'https://ipfs.io/ipfs/QmdiA6eywkjMAVGTYRXerSQozLEBA3QpKmAt1E1mKVovhz?filename=undefined'
const codeconMetadataUrl = 'https://ipfs.io/ipfs/QmdMbGwGLmC5iNmv1hzRvJQpzrKmKfHjbB34k4e8AfqKay?filename=Codecon%20Tech%20Event'
const webArMetadataUrl = 'https://ipfs.io/ipfs/QmSzFfx3rNqdJwSsrFpfMcxZCncaATsCceaFEr6Lmq3VUz?filename=Showing%20off%20WebAR'

// Адаптируем для ERC1155 TransferSingle event
async function getMintedTokenInfo (transaction) {
  const transactionResult = await transaction.wait();
  const event = transactionResult.events.find(e => e.event === 'TransferSingle' || e.event === 'TransferBatch');
  if (!event) throw new Error("No TransferSingle/Batch event found");

  if (event.event === 'TransferSingle') {
    const id = event.args[3];
    const amount = event.args[4];
    return { id: id.toNumber(), amount: amount.toNumber() };
  } else {
    throw new Error("TransferBatch not yet supported by getMintedTokenInfo");
  }
}

async function getCreatedMarketItemInfo (transaction) {
  const transactionResult = await transaction.wait();
  const marketItemEvent = transactionResult.events.find(event => event.event === 'MarketItemCreated');
  if (!marketItemEvent) throw new Error("MarketItemCreated event not found");

  const marketItemId = marketItemEvent.args[0];
  const tokenId = marketItemEvent.args[1];
  const amount = marketItemEvent.args[2];
  return { marketItemId: marketItemId.toNumber(), tokenId: tokenId.toNumber(), amount: amount.toNumber() };
}

async function setupMarket (marketplaceAddress, nftAddress) {
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
  const dogsTokenId = 1;
  const techEventTokenId = 2;
  const codeconTokenId = 3;
  const webArTokenId = 4;

  await nftContract.mint(acc1.address, dogsTokenId, mintAmount, '0x');
  await nftContract.mint(acc1.address, techEventTokenId, mintAmount, '0x');
  await nftContract.mint(acc1.address, codeconTokenId, mintAmount, '0x');
  await nftContract.mint(acc1.address, webArTokenId, mintAmount, '0x');
  console.log(`${acc1.address} minted ${mintAmount} of each token IDs: ${dogsTokenId}, ${techEventTokenId}, ${codeconTokenId}, ${webArTokenId}`);

  await nftContract.setApprovalForAll(marketplaceContract.address, true);
  console.log(`${acc1.address} approved marketplace for all their ERC1155 tokens`);

  const listAmount = 50;
  await marketplaceContract.createMarketItem(nftContractAddress, dogsTokenId, listAmount, price, { value: listingFee });
  await marketplaceContract.createMarketItem(nftContractAddress, techEventTokenId, listAmount, price, { value: listingFee });
  const codeconMarketTx = await marketplaceContract.createMarketItem(nftContractAddress, codeconTokenId, listAmount, price, { value: listingFee });
  const { marketItemId: codeconMarketItemId } = await getCreatedMarketItemInfo(codeconMarketTx);
  await marketplaceContract.createMarketItem(nftContractAddress, webArTokenId, listAmount, price, { value: listingFee });
  console.log(`${acc1.address} listed ${listAmount} of tokens ${dogsTokenId}, ${techEventTokenId}, ${codeconTokenId} and ${webArTokenId} as market items`);

  await marketplaceContract.cancelMarketItem(codeconMarketItemId);
  console.log(`${acc1.address} canceled market item for token ${codeconTokenId} (Market Item ID: ${codeconMarketItemId})`);

  const yellowTokenId = 5;
  const ashleyTokenId = 6;

  await nftContract.connect(acc2).mint(acc2.address, yellowTokenId, mintAmount, '0x');
  await nftContract.connect(acc2).mint(acc2.address, ashleyTokenId, mintAmount, '0x');
  console.log(`${acc2.address} minted ${mintAmount} of each token IDs: ${yellowTokenId}, ${ashleyTokenId}`);

  await nftContract.connect(acc2).setApprovalForAll(marketplaceContract.address, true);
  console.log(`${acc2.address} approved marketplace for all their ERC1155 tokens`);

  await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, yellowTokenId, listAmount, price, { value: listingFee });
  await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, ashleyTokenId, listAmount, price, { value: listingFee });
  console.log(`${acc2.address} listed ${listAmount} of tokens ${yellowTokenId} and ${ashleyTokenId} as market items`);
}