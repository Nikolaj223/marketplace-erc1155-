// предоставляет адреса смарт-контрактов (маркетплейса и NFT-контракта) в зависимости от запрашиваемой сети 
export default function handler(req, res) {
  const network = req.query.network;
  console.log(network); // Вывод значения network для отладки

  if (!network) {
    return res.status(400).json({ error: "Network parameter is required" });
  }

  try {
    const marketplaceAddress = process.env[`MARKETPLACE_CONTRACT_ADDRESS_${network.toUpperCase()}`];
    const nftAddress = process.env[`TESTTOKEN_ADDRESS_${network.toUpperCase()}`];
    const erc20Address = process.env[`TEST_ERC20_CONTRACT_ADDRESS_${network.toUpperCase()}`];
    const blacklistAddress = process.env[`BLACKLIST_CONTRACT_ADDRESS_${network.toUpperCase()}`];

    if (!marketplaceAddress || !nftAddress || !erc20Address || !blacklistAddress) {
      console.log("Missing environment variables:", { marketplaceAddress, nftAddress, erc20Address, blacklistAddress });
      return res.status(500).json({ error: "Missing contract address in environment variables" });
    }

    res.status(200).json({
      marketplaceAddress: marketplaceAddress,
      nftAddress: nftAddress,
      erc20Address: erc20Address,
      blacklistAddress: blacklistAddress // Теперь возвращаем blacklistAddress
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch contract addresses" });
  }
}










// export default function handler (req, res) {
//   const network = req.query.network
//   res.status(200).json({
//     marketplaceAddress: process.env[`MARKETPLACE_CONTRACT_ADDRESS_${network}`],
//     nftAddress: process.env[`NFT_CONTRACT_ADDRESS_${network}`]
//   })
// }
