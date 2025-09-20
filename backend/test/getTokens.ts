import { expect } from "chai";
import { ethers } from "hardhat";
import { Marketplace, TestToken, TestERC20} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Marketplace - getTokens Test", function () {
  let marketplace: Marketplace;
  let tokenContract: TestToken;
  let usdtContract: TestERC20;
  let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress;
  let ownerAddress: string, addr1Address: string, addr2Address: string;

  async function deployOnlyContracts() {
    [owner, addr1, addr2] = await ethers.getSigners() as SignerWithAddress[];
    ownerAddress = await owner.address;
    addr1Address = await addr1.address;
    addr2Address = await addr2.address;

    const TestTokenFactory = await ethers.getContractFactory("TestToken");
    const tokenContract = await TestTokenFactory.deploy("ipfs://your_ipfs_uri") as TestToken;
    await tokenContract.waitForDeployment();

    const TestERC20Factory = await ethers.getContractFactory("TestERC20");
    const usdtContract = await TestERC20Factory.deploy("Tether", "USDT", 18) as TestERC20;
    await usdtContract.waitForDeployment();

    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    const marketplace = await MarketplaceFactory.deploy(tokenContract.target, ownerAddress, usdtContract.target) as Marketplace;
    await marketplace.waitForDeployment();

    return { marketplace, tokenContract, usdtContract, owner, addr1, addr2, ownerAddress, addr1Address, addr2Address };
  }

  beforeEach(async function () {
    ({ marketplace, tokenContract, usdtContract, owner, addr1, addr2, ownerAddress, addr1Address, addr2Address } = await loadFixture(deployOnlyContracts));
    await tokenContract.connect(owner).mint(addr1Address, 1, 1, "0x"); // Mint 1 токен ID 1 для addr1
    await tokenContract.connect(addr1).setApprovalForAll(marketplace.target, true);
  });

  it("Should remove token from available lists when amount reaches 0 after buying", async function () {
    const tokenId = 1;
    const buyAmount = 1;

    // --- Настройка: добавляем 1 токен ID 1 на продажу от addr1 ---
    await marketplace.connect(addr1).addTokens([tokenId], [1], [ethers.parseUnits("100", 6)]);

    // Проверяем начальное состояние
    // Если canBePurchasedFrom(tokenId, 0) - это функция, возвращающая адрес по индексу
    let initialOwnerAtIndex0 = await marketplace.canBePurchasedFrom(tokenId, 0);
    expect(initialOwnerAtIndex0).to.equal(addr1Address, "Pre-buy: addr1 should be at index 0 in canBePurchasedFrom");

    // Если у вас canBePurchasedFrom(tokenId) - это getter для массива
    // let initialCanBePurchasedFromList = await marketplace.canBePurchasedFrom(tokenId);
    // expect(initialCanBePurchasedFromList.length).to.equal(1, "Pre-buy: canBePurchasedFrom should have 1 owner");
    // expect(initialCanBePurchasedFromList[0]).to.equal(addr1Address, "Pre-buy: addr1 should be in canBePurchasedFrom list");

    // Проверяем другие начальные состояния (для полноты)
    let initialTokensByOwner = await marketplace.getTokensByOwner(addr1Address);
    expect(initialTokensByOwner.length).to.equal(1, "Initial tokensByOwner should have 1 item");
    expect(initialTokensByOwner[0]).to.equal(tokenId, "Initial tokensByOwner should contain token 1");

    // --- Подготовка к покупке (USDT) ---
    const pricePerToken = ethers.parseUnits("100", 6);
    const feePercentage = await marketplace.fee();
    const feeAmount = (pricePerToken * feePercentage) / 100n;
    const totalAmountToApprove = pricePerToken + feeAmount;

    await usdtContract.connect(addr2).mint(addr2.address, totalAmountToApprove);
    await usdtContract.connect(addr2).approve(marketplace.target, totalAmountToApprove);

    // --- Покупаем токен ---
    await marketplace.connect(addr2).buy([tokenId], [buyAmount]);

    // --- Проверка состояния после покупки ---

    // 4. Проверяем, что canBePurchasedFrom[tokenId] теперь пуст.
    // Если он пуст, то вызов canBePurchasedFrom(tokenId, 0) должен ревертнуть,
    // так как индекс 0 будет за пределами диапазона.
    await expect(marketplace.canBePurchasedFrom(tokenId, 0)).to.be.reverted;

    // Если вы используете геттер массива:
    // const finalCanBePurchasedFromList = await marketplace.canBePurchasedFrom(tokenId);
    // expect(finalCanBePurchasedFromList.length).to.equal(0, "Post-buy: canBePurchasedFrom should be empty after purchase");


    // Проверяем, что tokenByOwner пуст
    const tokensByOwner = await marketplace.getTokensByOwner(addr1Address);
    expect(tokensByOwner.length).to.equal(0, "tokensByOwner should be empty after purchase");

    // Проверяем, что ownedTokens mapping обнулен
    const ownedToken = await marketplace.ownedTokens(addr1Address, tokenId);
    expect(Number(ownedToken.amount)).to.equal(0, "ownedToken.amount should be 0 after purchase");
    expect(Number(ownedToken.price)).to.equal(0, "ownedToken.price should be 0 after purchase"); 
    });
});
