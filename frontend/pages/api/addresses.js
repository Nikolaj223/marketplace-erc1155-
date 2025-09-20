// предоставляет адреса смарт-контрактов (маркетплейса и NFT-контракта) в зависимости от запрашиваемой сети 
export default function handler (req, res) {
  const network = req.query.network;

  // Проверяем, что сеть указана
  if (!network) {
    return res.status(400).json({ error: "Network parameter is required" });
  }

  try {
    const marketplaceAddress = process.env[`MARKETPLACE_CONTRACT_ADDRESS_${network}`];
    const nftAddress = process.env[`NFT_CONTRACT_ADDRESS_${network}`];
    const erc20Address = process.env[`ERC20_CONTRACT_ADDRESS_${network}`]; // Добавлен ERC20
    const usdtAddress = process.env[`USDT_CONTRACT_ADDRESS_${network}`];   // Добавлен USDT

    // Проверяем, что все необходимые переменные окружения установлены
    if (!marketplaceAddress || !nftAddress || !erc20Address || !usdtAddress) {
      return res.status(500).json({ error: "Missing contract address in environment variables" });
    }

    res.status(200).json({
      marketplaceAddress: marketplaceAddress,
      nftAddress: nftAddress,
      erc20Address: erc20Address, // Возвращаем ERC20 адрес
      usdtAddress: usdtAddress     // Возвращаем USDT адрес
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
