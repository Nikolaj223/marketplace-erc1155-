const hre = require('hardhat');

async function main() {

    // 1. Развертываем TestERC20
    const TestERC20 = await hre.ethers.getContractFactory('TestERC20');
    const testERC20 = await TestERC20.deploy("MyToken", "MTK", 18);
    await testERC20.waitForDeployment(); // Ждем завершения развертывания
    const testERC20Address = await testERC20.getAddress(); // Получаем адрес
    console.log('TestERC20 deployed to:', testERC20Address);

    // 2. Развертываем BlacklistControl
    const BlacklistControl = await hre.ethers.getContractFactory('BlacklistControl');
    const blacklistControl = await BlacklistControl.deploy();
    await blacklistControl.waitForDeployment(); // Ждем завершения развертывания
    const blacklistControlAddress = await blacklistControl.getAddress(); // Получаем адрес
    console.log('BlacklistControl deployed to:', blacklistControlAddress);

    // 3. Развертываем TestToken
    const NFTContract = await hre.ethers.getContractFactory('TestToken');
    const initialUri = "https://example.com/nft/";
    const nftContract = await NFTContract.deploy(initialUri);
    await nftContract.waitForDeployment(); // Ждем завершения развертывания
    const nftContractAddress = await nftContract.getAddress(); // Получаем адрес
    console.log('TestToken deployed to:', nftContractAddress);

    // 4. Развертываем Marketplace
    console.log('Deploying Marketplace...');
    const Marketplace = await hre.ethers.getContractFactory('Marketplace');
    const [deployer] = await hre.ethers.getSigners();

     // Проверяем, что адреса валидны
     if (!nftContractAddress) {
         console.error("Ошибка: nftContract не развернут или не имеет адреса.");
         return;
     }
     if (!testERC20Address) {
         console.error("Ошибка: testERC20 не развернут или не имеет адреса.");
         return;
     }

    const marketplace = await Marketplace.deploy(nftContractAddress, deployer.address, testERC20Address);
    await marketplace.waitForDeployment(); // Ждем завершения развертывания
    console.log('Marketplace deployed to:', await marketplace.getAddress());

    // Обновление .env.local с адресами контрактов (аналогично)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });








// const hre = require('hardhat');
// const dotenv = require('dotenv');
// const fs = require('fs');
// const path = require('path');

// async function main() {

//     console.log('Deploying TestERC20...');
//     const TestERC20 = await hre.ethers.getContractFactory('TestERC20');
//     const testERC20 = await TestERC20.deploy("MyToken", "MTK", 18);
//     await testERC20.waitForDeployment();
//     console.log('TestERC20 deployed to:', await testERC20.getAddress());

//     console.log('Deploying BlacklistControl...');
//     const BlacklistControl = await hre.ethers.getContractFactory('BlacklistControl');
//     const blacklistControl = await BlacklistControl.deploy();
//     await blacklistControl.waitForDeployment();
//     console.log('BlacklistControl deployed to:', await blacklistControl.getAddress());

    
//      console.log('Deploying TestToken...');
//     const NFTContract = await hre.ethers.getContractFactory('TestToken');
//     const initialUri = "https://example.com/nft/"; // Замените на нужный URI
//     const nftContract = await NFTContract.deploy(initialUri); // Передаем initialUri
//     await nftContract.waitForDeployment();
//     console.log('TestToken deployed to:', await nftContract.getAddress());

    
//        console.log('Deploying Marketplace...');
//     const Marketplace = await hre.ethers.getContractFactory('Marketplace');
//     const [deployer] = await hre.ethers.getSigners();

//     // Проверяем, что адреса валидны
//     if (!nftContract || !nftContract.address) {
//         console.error("Ошибка: nftContract не развернут или не имеет адреса.");
//         return;
//     }
//     if (!testERC20 || !testERC20.address) {
//         console.error("Ошибка: testERC20 не развернут или не имеет адреса.");
//         return;
//     }

//     const marketplace = await Marketplace.deploy(nftContract.address, deployer.address, testERC20.address);
//     await marketplace.waitForDeployment();
//     console.log('Marketplace deployed to:', await marketplace.getAddress());

//     // Обновление .env.local с адресами контрактов
//     const envFileName = path.resolve(__dirname, '../.env.local');
//     let envConfig = dotenv.config({ path: envFileName }).parsed;

//     if (!envConfig) {
//         envConfig = {};
//     }

//     envConfig[`MARKETPLACE_CONTRACT_ADDRESS_SEPOLIA`] = await marketplace.getAddress();
//     envConfig[`TestToken_ADDRESS_SEPOLIA`] = await nftContract.getAddress();
//     envConfig[`TEST_ERC20_CONTRACT_ADDRESS_SEPOLIA`] = await testERC20.getAddress();
//     envConfig[`BLACKLIST_CONTRACT_ADDRESS_SEPOLIA`] = await blacklistControl.getAddress();

//     const envString = Object.keys(envConfig).map(key => `${key}=${envConfig[key]}`).join('\n');
//     fs.writeFileSync(envFileName, envString + '\n');

//     console.log('.env.local updated with new contract addresses.');
// }

// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });












// const hre = require('hardhat');
// const dotenv = require('dotenv');
// const fs = require('fs');
// const path = require('path');

// async function main() {
//     // 1. Развертывание TestERC20
//     console.log('Deploying TestERC20...');
//     const TestERC20 = await hre.ethers.getContractFactory('TestERC20');
//     const testERC20 = await await TestERC20.deploy("MyToken", "MTK", 18);

//     // Ждем, пока контракт развернется и получим его адрес.
//     // Важно дождаться завершения развертывания перед получением адреса.
//     await testERC20.waitForDeployment();
//     console.log('TestERC20 deployed to:', await testERC20.getAddress());


//     // 2. Развертывание BlacklistControl
//     console.log('Deploying BlacklistControl...');
//     const BlacklistControl = await hre.ethers.getContractFactory('BlacklistControl');
//     const blacklistControl = await await BlacklistControl.deploy();
//     await blacklistControl.waitForDeployment();
//     console.log('BlacklistControl deployed to:', await blacklistControl.getAddress());

//     // 3. Развертывание NFT Contract
//     console.log('Deploying TestToken...');
//     const NFTContract = await hre.ethers.getContractFactory('TestToken');
//     const nftContract = await await NFTContract.deploy();
//     await nftContract.waitForDeployment();
//     console.log('TestToken deployed to:', await nftContract.getAddress());

//     // 4. Развертывание Marketplace
//     console.log('Deploying Marketplace...');
//     const Marketplace = await hre.ethers.getContractFactory('Marketplace');
//     const marketplace = await await Marketplace.deploy(nftContract.address, testERC20.address, blacklistControl.address);
//     await marketplace.waitForDeployment();
//     console.log('Marketplace deployed to:', await marketplace.getAddress());

//     // Обновление .env.local с адресами контрактов
//     const envFileName = path.resolve(__dirname, '../.env.local');
//     let envConfig = dotenv.config({ path: envFileName }).parsed;

//     if (!envConfig) {
//         envConfig = {};
//     }

//     envConfig[`MARKETPLACE_CONTRACT_ADDRESS_SEPOLIA`] = await marketplace.getAddress();
//     envConfig[`TestToken_ADDRESS_SEPOLIA`] = await nftContract.getAddress();
//     envConfig[`TEST_ERC20_CONTRACT_ADDRESS_SEPOLIA`] = await testERC20.getAddress();
//     envConfig[`BLACKLIST_CONTRACT_ADDRESS_SEPOLIA`] = await blacklistControl.getAddress();

//     const envString = Object.keys(envConfig).map(key => `${key}=${envConfig[key]}`).join('\n');
//     fs.writeFileSync(envFileName, envString + '\n');

//     console.log('.env.local updated with new contract addresses.');
// }

// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });