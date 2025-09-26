// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";
// import "@nomicfoundation/hardhat-verify";

// dotenv.config();

// const config: HardhatUserConfig & { remappings?: string[] } = {
//   defaultNetwork: 'hardhat',
//   networks: {
//     hardhat: {
//       accounts: {
//         count: 20
//       }
//     },
//     sepolia: {
//       url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`,
//       accounts: [process.env.SEPOLIA_TESTNET_PRIVATE_KEY || ""],
//     },
//   },
//   solidity: {
//     version: "0.8.28",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY, // Добавьте ваш Etherscan API key в .env
//   },
//   paths: {
//     sources: "./contracts",
//     cache: "./cache",
//     artifacts: "./artifacts"
//   },
//   remappings: [
//     "@openzeppelin/=node_modules/@openzeppelin/"
//   ]
// };

// export default config;




import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat', 
  networks: {
    hardhat: {
      accounts: {
        count: 20 
      }
    },
    sepolia: { 
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`, 
      accounts: [process.env.SEPOLIA_TESTNET_PRIVATE_KEY || ""], 
    },
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Добавьте ваш Etherscan API key в .env
  },
};

export default config;













// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";

// dotenv.config();

// const config: HardhatUserConfig = {
//   defaultNetwork: 'hardhat', // Важно: Меняем сеть по умолчанию на Hardhat для тестов
//   networks: {
//     hardhat: {
//       accounts: {
//         count: 20 // Убедитесь, что достаточно аккаунтов для ваших тестов
//       }
//     },
//     sepolia: { // Конфигурация для сети Sepolia
//       url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`, // URL Infura для Sepolia из .env
//       accounts: [process.env.SEPOLIA_TESTNET_PRIVATE_KEY || ""], // Приватный ключ Sepolia из .env
//     },
//   },
//   solidity: {
//     version: "0.8.28",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
// };

// export default config;


















// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";

// dotenv.config();

// const config: HardhatUserConfig = {
//   defaultNetwork: 'hardhat',
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//     sepolia: { // Добавляем конфигурацию для сети Sepolia
//       url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`, // Замените на свой URL Infura или Alchemy для Sepolia
//       accounts: [process.env.SEPOLIA_TESTNET_PRIVATE_KEY || ""], // Используем приватный ключ Sepolia из .env
//     },
//     mumbai: {
//       url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
//       accounts: [process.env.ACCOUNT_PRIVATE_KEY || "", process.env.ACCOUNT2_PRIVATE_KEY || ""],
//       gas: 5500000,
//       gasPrice: 7000000000
//     },
//     mainnet: {
//       url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
//       accounts: [process.env.ACCOUNT_PRIVATE_KEY || "", process.env.ACCOUNT2_PRIVATE_KEY || ""],
//     }
//   },
//   solidity: {
//     version: "0.8.28",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
// };

// export default config;




























// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";

// dotenv.config(); // Загрузка переменных окружения из .env файла

// const config: HardhatUserConfig = {
//   defaultNetwork: 'hardhat', // Сеть по умолчанию
//   networks: {
//     hardhat: {
//       chainId: 1337, // Chain ID для локальной сети Hardhat
//     },
//     mumbai: { // Конфигурация для сети Polygon Mumbai
//       url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`, // URL Alchemy для Mumbai
//       accounts: [process.env.ACCOUNT_PRIVATE_KEY || "", process.env.ACCOUNT2_PRIVATE_KEY || ""], // Приватные ключи из .env.  Добавлена проверка на undefined.
//       gas: 5500000,
//       gasPrice: 7000000000
//     },
//     mainnet: { // Конфигурация для основной сети Ethereum
//       url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`, // URL Infura для Mainnet
//       accounts: [process.env.ACCOUNT_PRIVATE_KEY || "", process.env.ACCOUNT2_PRIVATE_KEY || ""], // Приватные ключи из .env.  Добавлена проверка на undefined.
//     }
//   },
//   solidity: {
//     version: "0.8.28", // Версия Solidity (актуализировано)
//     settings: {
//       optimizer: {
//         enabled: true, // Включаем оптимизатор
//         runs: 200 // Количество прогонов оптимизатора
//       }
//     }
//   },
// };

// export default config;