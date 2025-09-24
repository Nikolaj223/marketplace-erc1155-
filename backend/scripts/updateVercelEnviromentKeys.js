// ля автоматического обновления переменных окружения в Vercel
const axios = require('axios')
const hre = require('hardhat')

const vercelUrl = 'https://api.vercel.com'
const { VERCEL_PROJECT_ID, VERCEL_DEPLOY_TOKEN } = process.env

async function getProjectEnvironmentVariablesIds (...envNames) {
  try {
    const { data: { envs } } = await axios.get(`${vercelUrl}/v8/projects/${VERCEL_PROJECT_ID}/env`, {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
      }
    })

    return envs.reduce((envIds, env) => {
      if (!envNames.includes(env.key)) return envIds
      envIds[env.key] = env.id
      return envIds
    }, {})
  } catch (error) {
    console.log(error)
  }
}

async function updateVercelEnviromentVariableByNames (...envNames) {
  try {
    const envIds = await getProjectEnvironmentVariablesIds(...envNames)
    for (const envName in envIds) {
      await updateVercelEnviromentVariableById(envIds[envName], process.env[envName])
      console.log(`Vercel env ${envName}=${process.env[envName]} updated`)
    }
  } catch (error) {
    console.log(error)
  }
}
async function updateVercelEnviromentVariableById (id, newValue) {
  try {
    await axios.patch(`${vercelUrl}/v8/projects/${VERCEL_PROJECT_ID}/env/${id}`, {
      value: newValue
    }, {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function triggerDeployment () {
  try {
    console.log('Triggering a new deployment...')
    await axios.post(`${vercelUrl}/v1/integrations/deploy/${VERCEL_PROJECT_ID}/${VERCEL_DEPLOY_TOKEN}`)
  } catch (error) {
    console.log(error)
    console.log(error.response.data)
  }
}

async function main () {
  const networkName = hre.network.name.toUpperCase(); // SEPOLIA
const marketplaceAddress = `MARKETPLACE_CONTRACT_ADDRESS_${networkName}`;
const nftAddress = `TestToken_ADDRESS_${networkName}`;
const erc20Address = `TEST_ERC20_CONTRACT_ADDRESS_${networkName}`;
const blacklistAddress = `BLACKLIST_CONTRACT_ADDRESS_${networkName}`;

await updateVercelEnviromentVariableByNames(marketplaceAddress, nftAddress, erc20Address, blacklistAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

//   Этот скрипт предназначен для автоматического обновления переменных окружения в Vercel после развертывания.
// Для работы скрипту нужны API-ключи Vercel: VERCEL_PROJECT_ID и VERCEL_TOKEN
//  (или VERCEL_DEPLOY_TOKEN, нужно уточнить в документации Vercel).
// В .env backend должны быть определены VERCEL_PROJECT_ID и VERCEL_TOKEN.
// Скрипт запрашивает ID переменных окружения в Vercel, а затем обновляет значения переменных
//  MARKETPLACE_CONTRACT_ADDRESS_${networkName} и NFT_CONTRACT_ADDRESS_${networkName} на Vercel.