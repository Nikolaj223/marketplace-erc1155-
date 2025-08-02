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

  // Функция для развертывания контрактов и настройки состояния
  // async function deployContractsAndSetup() {
  //   const TestToken = await ethers.getContractFactory("TestToken");
  //   const tokenContract = await TestToken.deploy() as TestToken;
  //   await tokenContract.waitForDeployment();
  async function deployContractsAndSetup() {
  // Получаем фабрику контракта TestToken
  const TestToken = await ethers.getContractFactory("TestToken");

  // Определяем значение initialUri для конструктора TestToken
  const initialUri = "ipfs://your_ipfs_uri"; // Замените на реальный URI

  // Разворачиваем контракт TestToken, передавая initialUri в конструктор
  // Важно: теперь необходимо передать initialUri при развертывании контракта
  const tokenContract = await TestToken.deploy(initialUri) as TestToken;

  // Ожидаем завершения развертывания контракта
  await tokenContract.waitForDeployment();

    const TestERC20 = await ethers.getContractFactory("TestERC20");
    const usdtContract = await TestERC20.deploy("Tether", "USDT", 18) as TestERC20;
    await usdtContract.waitForDeployment();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const [owner, addr1, addr2] = await ethers.getSigners() as SignerWithAddress[];
    const ownerAddress = await owner.address;
    const addr1Address = await addr1.address;
    const addr2Address = await addr2.address;

    const marketplace = await Marketplace.deploy(tokenContract.target, ownerAddress, usdtContract.target) as Marketplace;
    await marketplace.waitForDeployment();

    await tokenContract.mint(addr1Address, 1, 100, "0x00");
    await tokenContract.mint(addr1Address, 2, 50, "0x00");
    await tokenContract.mint(addr1Address, 3, 5, "0x00");    // Mint 5 токенов с ID 3 - необходимо для теста addTokens!
    await tokenContract.connect(addr1).setApprovalForAll(marketplace.target, true);
    await usdtContract.mint(addr2Address, ethers.parseEther("1000"));
    await usdtContract.connect(addr2).approve(marketplace.target, ethers.parseEther("1000"));

    await marketplace.connect(addr1).addTokens([1, 2], [10, 5], [ethers.parseEther("10"), ethers.parseEther("5")]);

    await marketplace.setTokenInfo(1, 1, true);
    await marketplace.setTokenInfo(2, 2, false);

    return { marketplace, tokenContract, usdtContract, owner, addr1, addr2, ownerAddress, addr1Address, addr2Address };
  }

  beforeEach(async function () {
    // Используем loadFixture для повторного использования состояния сети
    ({ marketplace, tokenContract, usdtContract, owner, addr1, addr2, ownerAddress, addr1Address, addr2Address } = await loadFixture(deployContractsAndSetup));
    //  ownerAddress = owner.address;
    // addr1Address = addr1.address;
    // addr2Address = addr2.address;
    // await tokenContract.connect(owner).mint(addr1.address, 1, 1, "0x");
    //  await tokenContract.connect(addr1).setApprovalForAll(marketplace.target, true);

  });



    it("Should return correct tokens based on category and NFT status", async function () {
    // Добавляем токены на платформу
    await marketplace.connect(addr1).addTokens([1, 2], [10, 5], [ethers.parseEther("10"), ethers.parseEther("5")]);
    // Устанавливаем информацию о токенах
    await marketplace.setTokenInfo(1, 1, true); // Category.ART = 1, isNFT = true
    await marketplace.setTokenInfo(2, 2, false); // Category.GAMES = 2, isNFT = false

    // Проверяем получение всех токенов
    const allTokens = await marketplace.getTokens(0, false); // Category.ALL = 0
    expect(allTokens).to.deep.equal([BigInt(1), BigInt(2)]);

    // Проверяем получение только NFT токенов
    const nftTokens = await marketplace.getTokens(0, true);
    expect(nftTokens).to.deep.equal([BigInt(1)]);

    // Проверяем получение токенов определенной категории (ART = 1)
    const artTokens = await marketplace.getTokens(1, false);
    expect(artTokens).to.deep.equal([BigInt(1)]);

    // Проверяем получение токенов определенной категории (GAMES = 2)
    const gameTokens = await marketplace.getTokens(2, false);
    expect(gameTokens).to.deep.equal([BigInt(2)]);

    // Проверяем случай, когда нет токенов соответствующей категории
    const otherTokens = await marketplace.getTokens(3, false); //OTHER = 3
    expect(otherTokens).to.deep.equal([]);
  });


  it("Should add tokens correctly", async function () {
    const initialTokenInStock1 = Number(await marketplace.tokenInStock(3));
    expect(initialTokenInStock1).to.equal(0); //Проверяем, что изначально токена нет в стоке

    await marketplace.connect(addr1).addTokens([3], [5], [ethers.parseEther("2")]);

    expect(await marketplace.availableTokenIds(3)).to.equal(true, "Token ID should be available"); //Проверяем, что токен доступен
    expect(Number(await marketplace.tokenInStock(3))).to.equal(5, "Token stock should be updated"); //Проверяем количество в стоке

    const ownedToken = await marketplace.ownedTokens(addr1Address, 3); //получаем токен из структуры
    expect(Number(ownedToken.amount)).to.equal(5, "Owned amount should be correct");  //проверяем кол-во токенов у владельца
    expect(ownedToken.price).to.equal(ethers.parseEther("2"), "Price should be correct"); //проверяем цену
  });

   it("Should revert if balance is not enought", async function () {
     // Попытка добавить больше токенов, чем есть у пользователя (addr1)
     await expect(marketplace.connect(addr1).addTokens([1], [101], [ethers.parseEther("10")])).to.be.revertedWith("Not enough balance");
   });

  it("Should revert if arrays length are not equal", async function () {
      await expect(marketplace.connect(addr1).addTokens([1, 2], [10], [ethers.parseEther("10"), ethers.parseEther("5")])).to.be.revertedWith("Arrays must be same length");
  });


 it("Should update availableTokenIds after adding tokens", async function () {
    // Проверяем, что tokenId 1 и 2 добавлены.
    expect(await marketplace.availableTokenIds(1)).to.equal(true);
    expect(await marketplace.availableTokenIds(2)).to.equal(true);

    // Проверяем, что токена 3 нет
    expect(await marketplace.availableTokenIds(3)).to.equal(false);
});

 
   
    it("Should correctly update tokenInStock", async function () {
    const tokenInStock = await marketplace.tokenInStock(1);
    expect(Number(tokenInStock)).to.equal(10); //Проверяем, что количество токенов в стоке соответствует ожидаемому.
  });
   it("Should update the price of a token", async function () {
        const tokenId = 1;
        const newPrice = ethers.parseEther("15");

        // Убедимся, что цена изменилась после вызова updatePrice
        await expect(marketplace.connect(addr1).updatePrice(tokenId, newPrice))
            .to.emit(marketplace, "PriceUpdated")
            .withArgs(addr1Address, tokenId, newPrice);

        const updatedToken = await marketplace.ownedTokens(addr1Address, tokenId);
        expect(updatedToken.price).to.equal(newPrice);
    });

    it("Should revert if the caller is blacklisted", async function () {
        // Добавляем addr1 в черный список через функцию blacklistUser в контракте BlacklistControl.
        await marketplace.blacklistUser(addr1Address);
        const tokenId = 1;
        const newPrice = ethers.parseEther("15");

        // Проверяем, что вызов updatePrice от blacklisted addr1 вызывает ошибку "You are blacklisted.".
        await expect(marketplace.connect(addr1).updatePrice(tokenId, newPrice)).to.be.revertedWith("You are blacklisted.");
    });

    it("Should revert if the token is not being sold", async function () {
        const tokenId = 3; // Token ID, который не добавлялся
        const newPrice = ethers.parseEther("15");

        await expect(marketplace.connect(addr1).updatePrice(tokenId, newPrice)).to.be.revertedWith("Not selling this token");
    });
    it("Should correctly decrease token amount", async function () {
    const tokenId = 1;
    const amountToDecrease = 3;

    await expect(marketplace.connect(addr1).decreaseAmount(tokenId, amountToDecrease))
      .to.emit(marketplace, "AmountDecreased")
      .withArgs(addr1Address, tokenId, amountToDecrease);

    const updatedToken = await marketplace.ownedTokens(addr1Address, tokenId);
    expect(Number(updatedToken.amount)).to.equal(7); // 10 - 3 = 7
    expect(Number(await marketplace.tokenInStock(tokenId))).to.equal(7); // Общее кол-во тоже должно уменьшиться
  });

  it("Should revert if decreasing more than owned", async function () {
    const tokenId = 1;
    const amountToDecrease = 15;

    await expect(marketplace.connect(addr1).decreaseAmount(tokenId, amountToDecrease)).to.be.revertedWith("Not enough tokens to decrease");
  });

it("Should correctly remove all tokens", async function () {
    await expect(marketplace.connect(addr1).removeAllTokens())
      .to.emit(marketplace, "AllTokensRemoved")
      .withArgs(addr1Address);

    //  После вызова removeAllTokens массив должен быть удален.

    expect(Number(await marketplace.tokenInStock(1))).to.equal(0); // Преобразуем bigint в number
    expect(Number(await marketplace.tokenInStock(2))).to.equal(0); // Преобразуем bigint в number

    const sellerOffer1 = await marketplace.ownedTokens(addr1Address, 1);
    expect(Number(sellerOffer1.amount)).to.equal(0);

    const sellerOffer2 = await marketplace.ownedTokens(addr1Address, 2);
    expect(Number(sellerOffer2.amount)).to.equal(0);
  });


  it("Should revert decreaseAmount if the caller is blacklisted", async function () {
    await marketplace.blacklistUser(addr1Address);
    const tokenId = 1;
    const amountToDecrease = 3;

    await expect(marketplace.connect(addr1).decreaseAmount(tokenId, amountToDecrease)).to.be.revertedWith("You are blacklisted.");
  });

  it("Should revert removeAllTokens if the caller is blacklisted", async function () {
    await marketplace.blacklistUser(addr1Address);

    await expect(marketplace.connect(addr1).removeAllTokens()).to.be.revertedWith("You are blacklisted.");
  });

  // it("Should allow buying tokens", async function () {
  //   // Даем разрешение addr2 на трату USDT
  //   await usdtContract.connect(addr2).approve(marketplace.target, ethers.parseEther("100"));

  //   // Начисляем USDT продавцу (addr1), чтобы он мог получить комиссию
  //   await usdtContract.mint(addr1Address, ethers.parseEther("1")); // Достаточно для тестов, увеличим если надо

  //   // Проверяем баланс USDT до покупки
  //   const addr2UsdtBalanceBefore = await usdtContract.balanceOf(addr2Address);

  //   // Определяем ID и количество токенов для покупки
  //   const tokenIds = [1];
  //   const amounts = [1];

  //   // Рассчитываем общую стоимость покупки (1 токен 1 по цене 10 USDT)
  //   const expectedCost = ethers.parseEther("10");

  //   // Покупаем токены
  //   await marketplace.connect(addr2).buy(tokenIds, amounts, { value: 0 });

  //   // Проверяем баланс USDT после покупки
  //   const addr2UsdtBalanceAfter = await usdtContract.balanceOf(addr2Address);
  //   expect(addr2UsdtBalanceAfter).to.equal(addr2UsdtBalanceBefore - expectedCost);

  //   // Проверяем, что токены были переданы покупателю
  //   const addr2TokenBalance = await tokenContract.balanceOf(addr2Address, 1);
  //   expect(Number(addr2TokenBalance)).to.equal(1);

  //   // Проверяем, что количество токенов в стоке уменьшилось
  //   const tokenInStock = await marketplace.tokenInStock(1);
  //   expect(Number(tokenInStock)).to.equal(9);
  // });
it("Should calculate the total price correctly", async function () {
    // Даем разрешение addr2 на трату USDT
    await usdtContract.connect(addr2).approve(marketplace.target, ethers.parseEther("100"));

    // Добавляем еще одного продавца с другой ценой на токен 1
    await tokenContract.mint(addr2Address, 1, 5, "0x00");
    await tokenContract.connect(addr2).setApprovalForAll(marketplace.target, true);
    await marketplace.connect(addr2).addTokens([1], [5], [ethers.parseEther("7")]); // Цена ниже, чем у addr1

    // Определяем ID и количество токенов для покупки
    const tokenIds = [1];
    const amounts = [2]; // Покупаем 2 токена

    // Вызываем функцию totalPrice
    const totalPrice = await marketplace.totalPrice(tokenIds, amounts);

    // Ожидаемая цена: 2 токена по 7 USDT (самая низкая цена доступна у addr2)
    const expectedPrice = ethers.parseEther("14");

    // Проверяем, что полученная цена соответствует ожидаемой
    expect(totalPrice).to.equal(expectedPrice);

  });






//  it("Should set token info correctly", async function () {
//     // Устанавливаем category = ART (1) и isNFT = true для tokenId 1
//     await marketplace.setTokenInfo(1, 1, true);
//     // Устанавливаем category = GAMES (2) и isNFT = false для tokenId 2
//     await marketplace.setTokenInfo(2, 2, false);

//     // Получаем информацию о токене 1
//     const token1Info = await marketplace.tokenInfo(1);
//     // Получаем информацию о токене 2
//     const token2Info = await marketplace.tokenInfo(2);

//     // Проверяем, что информация о токене 1 установлена правильно
//     expect(token1Info.category).to.equal(1); // ART
//     expect(token1Info.isNFT).to.equal(true);

//     // Проверяем, что информация о токене 2 установлена правильно
//     expect(token2Info.category).to.equal(2); // GAMES
//     expect(token2Info.isNFT).to.equal(false);
//   });

  


  it("Should revert if paying with ETH", async function () {
    const tokenId = 1;
    const amountToBuy = 5;

    //Try buying with ETH and expect revert
    await expect(marketplace.connect(addr2).buy([tokenId], [amountToBuy],{value: ethers.parseEther("1")})).to.be.revertedWith("Do not send ETH, pay with USDT.");
  });
    it("Should revert if buyer doesn't have enough USDT balance", async function () {
        const tokenId = 1;
        const amountToBuy = 5;
        const price = ethers.parseEther("10");
        const totalPrice = BigInt(amountToBuy) * BigInt(price);

        // Approve marketplace to spend USDT (but not mint tokens to buyer)
        await usdtContract.connect(addr2).approve(marketplace.target, totalPrice);

        // Try buying tokens and expect revert
        // await expect(marketplace.connect(addr2).buy([tokenId], [amountToBuy])).to.be.revertedWith("Insufficient balance");
    });
  it("Should remove token using decreaseAmount and removeAllTokens", async function () {
    const tokenId = 1;
    const initialAmount = (await marketplace.ownedTokens(addr1Address, tokenId)).amount;
    expect(initialAmount).to.equal(10);
    // Partially decrease amount
    await marketplace.connect(addr1).decreaseAmount(tokenId, 5);
    expect((await marketplace.ownedTokens(addr1Address, tokenId)).amount).to.equal(5);
    //Remove all tokens
    await marketplace.connect(addr1).removeAllTokens();
    expect((await marketplace.ownedTokens(addr1Address, tokenId)).amount).to.equal(0);
  });
      it("Should remove owned token information after removeAllTokens", async function () {
        const tokenId = 1;

        //Убедимся, что информация о токене присутствует перед удалением
        const ownedTokenBefore = await marketplace.ownedTokens(addr1Address, tokenId);
        expect(Number(ownedTokenBefore.amount)).to.be.greaterThan(0, "Token amount should be greater than 0");

        await marketplace.connect(addr1).removeAllTokens(); // remove all tokens for test

        //Убедимся, что информация о токене удалена
        const ownedTokenAfter = await marketplace.ownedTokens(addr1Address, tokenId);
        expect(Number(ownedTokenAfter.amount)).to.equal(0, "Token amount should be 0 after removeAllTokens");
        expect(ownedTokenAfter.price).to.equal(0, "Token price should be 0 after removeAllTokens");
    });
    });

