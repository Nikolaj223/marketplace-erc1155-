const hre = require('hardhat');
const dotenv = require('dotenv');
const fs = require('fs');

// Функция для обновления .env.local файла с адресами контрактов
function replaceEnvContractAddresses(marketplaceAddress, nftAddress, usdtAddress, networkName) {
    const envFileName = '../frontend/.env.local';
    const envFile = fs.readFileSync(envFileName, 'utf-8');
    const env = dotenv.parse(envFile);

    // Формируем ключи для переменных окружения
    const MARKETPLACE_KEY = `MARKETPLACE_CONTRACT_ADDRESS_${networkName.toUpperCase()}`;
    const NFT_KEY = `NFT_CONTRACT_ADDRESS_${networkName.toUpperCase()}`;
    const USDT_KEY = `USDT_CONTRACT_ADDRESS_${networkName.toUpperCase()}`;

    // Обновляем значения в объекте env
    env[MARKETPLACE_KEY] = marketplaceAddress;
    env[NFT_KEY] = nftAddress;
    env[USDT_KEY] = usdtAddress;

    // Преобразуем объект env обратно в строку
    const newEnv = Object.entries(env).map(([key, value]) => `${key}=${value}`).join('\n');

    fs.writeFileSync(envFileName, newEnv + '\n');
}


async function main() {
    process.env.IS_RUNNING = true;

    // Развертывание контракта MockUSDT
    console.log('Deploying TestERC20...');
    const TestERC20 = await hre.ethers.getContractFactory('TestERC20');
    const initialSupply = hre.ethers.parseUnits('1000000', 6);
    const usdtContract = await TestERC20.deploy(initialSupply);
    await usdtContract.deployed();
    console.log('TestERC20 deployed to:', usdtContract.address);

    // Развертывание контракта ERC1155 (NFT)
    console.log('Deploying TestToken...');
    const TestToken = await hre.ethers.getContractFactory('TestToken');
    const baseURI = "ipfs://your-default-base-uri-for-metadata/";
    const nftContract = await TestToken.deploy(baseURI);
    await nftContract.deployed();
    console.log('TestToken deployed to:', nftContract.address);

    // Развертывание контракта Marketplace
    console.log('Deploying Marketplace...');
    const Marketplace = await hre.ethers.getContractFactory('Marketplace');
    const tokenContractAddress = nftContract.address;
    const adminAddress = (await hre.ethers.getSigners())[0].address;
    const usdtContractAddress = usdtContract.address;

    const marketplace = await Marketplace.deploy(
        tokenContractAddress,
        adminAddress,
        usdtContractAddress
    );
    await marketplace.deployed();
    console.log('Marketplace deployed to:', marketplace.address);

    // Обновление .env.local
    replaceEnvContractAddresses(
        marketplace.address,
        nftContract.address,
        usdtContract.address,
        hre.network.name
    );

    console.log('.env.local updated with new contract addresses.');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });