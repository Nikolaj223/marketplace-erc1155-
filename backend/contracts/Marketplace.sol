//  SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC1155/ERC1155.sol)

pragma solidity ^0.8.20;

import {BlacklistControl} from "./BlacklistControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Импорт IERC20 для USDT


contract Marketplace  is BlacklistControl, Ownable {
   

    enum Category {
    ALL, // категория "Все"
    ART,
    GAMES,
    MUSIC,
    OTHER
}
struct TokenInfo {
    Category category;
    bool isNFT; // Флаг, указывающий является ли токен NFT (количество = 1)
}
    struct OwnedToken {
        uint amount; 
        uint price; 
    }
event TokensAdded(address indexed owner, uint[] tokenIds, uint[] amounts, uint[] prices); // Событие при добавлении токенов на продажу
event TokensBought(address indexed buyer, uint[] tokenIds, uint[] amounts);
event AmountDecreased(address indexed owner, uint indexed tokenId, uint amount); // Событие при частичном удалении токена 
event PriceUpdated(address indexed owner, uint indexed tokenId, uint newPrice);
event AllTokensRemoved(address indexed owner); 
event TokenMetadataUpdated(uint256 tokenId, string uri); // Событие для записи изменения URI метаданных
event Debug(uint256 tokenId, uint256 category, bool isNFT); // Объявляем событие
event TokenAvailable(uint256 tokenId);
event FeeProcessed(address indexed seller, address indexed owner, uint totalAmount, uint feeAmount, uint sellerAmount);

uint public fee = 3;
IERC1155 public tokenContract; 
IERC20 public usdtContract; 
uint256 public maxTokenId; // Максимальный tokenId, который был добавлен



mapping(address owner => mapping (uint tokenId => OwnedToken)) public ownedTokens;  //предложение продавца 

mapping (address owner => uint[] tokenIds) public tokensByOwner; //кол-во токена у каждого продавца 

mapping (uint tokenId => uint totalAmount) public tokenInStock; // сколько ввсего таких токнов можно купить у всех владельцев 

mapping (uint tokenId => address[] owners) public canBePurchasedFrom; // все адреса у которых есть конкретный токен 

mapping(uint256 => string) public tokenURIs;

mapping(uint256 => TokenInfo) public tokenInfo;

mapping(uint256 => bool) public availableTokenIds; // все что предлагает маркет плэйс 

 
   constructor(address _tokenContract, address _admin,  address _usdtContract) Ownable(msg.sender){ 
        tokenContract = IERC1155(_tokenContract);
        admin = _admin;
        usdtContract = IERC20(_usdtContract);
    }

// для выставления на продажу сразу много id
function addTokens(uint[] memory ids, uint[] memory amounts, uint[] memory prices) external {
    address tokensOwner = msg.sender;
    require(tokenContract.isApprovedForAll(tokensOwner, address(this)), "Approval needed");
    require(!blacklisted[msg.sender], "You are blacklisted.");

    uint count = ids.length;

    require(count == amounts.length && count == prices.length, "Arrays must be same length"); // все массивы должны иметь одинаковую длину

    for (uint i = 0; i < count; ++i) {
        uint currentId = ids[i];
        uint currentBalance = tokenContract.balanceOf(tokensOwner, currentId);
        uint currentAmount = amounts[i];

        require(currentBalance >= currentAmount, "Not enough balance");
        uint currentPrice = prices[i];
        require(currentPrice > 0, "Price must be greater than 0");

        // Проверка и обновление maxTokenId
        if (currentId > maxTokenId) {
            maxTokenId = currentId;
        }

        // Проверка, есть ли вообще этот токен на платформе, чтобы каждый раз не добавлять его
        if (!availableTokenIds[currentId]) { //изменено условие. Было tokenInStock[currentId] == 0
            availableTokenIds[currentId] = true;
            emit TokenAvailable(currentId); 
        }

        tokenInStock[currentId] += currentAmount;
        OwnedToken storage currentOwnedToken = ownedTokens[tokensOwner][currentId];

        if (currentOwnedToken.price == 0 && currentOwnedToken.amount == 0) {
            tokensByOwner[tokensOwner].push(currentId);
            canBePurchasedFrom[currentId].push(tokensOwner);
        }

        currentOwnedToken.price = currentPrice; // один владелец не может продавать один и тот же токен по разной цене
        currentOwnedToken.amount += currentAmount; // если владелец докладывает токены
    }
    emit TokensAdded(msg.sender, ids, amounts, prices);
}
  // Функция для изменения цены токена
    function updatePrice(uint tokenId, uint newPrice) external {
          require(!blacklisted[msg.sender], "You are blacklisted.");

        require(ownedTokens[msg.sender][tokenId].price > 0, "Not selling this token");
        ownedTokens[msg.sender][tokenId].price = newPrice;
        emit PriceUpdated(msg.sender, tokenId, newPrice);
    }
        // Функция частичной отмены предложения
    function decreaseAmount(uint tokenId, uint amountToDecrease) public {
        require(!blacklisted[msg.sender], "You are blacklisted.");
        require(ownedTokens[msg.sender][tokenId].amount >= amountToDecrease, "Not enough tokens to decrease");
        ownedTokens[msg.sender][tokenId].amount -= amountToDecrease;
        tokenInStock[tokenId] -= amountToDecrease;
        emit AmountDecreased(msg.sender, tokenId, amountToDecrease);
    }
    function removeAllTokens() external {
    require(!blacklisted[msg.sender], "You are blacklisted.");
    address tokensOwner = msg.sender;

    // Проходим по массиву с конца, чтобы удаление не нарушало итерацию.
    for (int i = int(tokensByOwner[tokensOwner].length) - 1; i >= 0; i--) {
        uint currentId = tokensByOwner[tokensOwner][uint(i)];

        // Важно проверить, что токен еще существует, перед тем как удалять.
        if (ownedTokens[tokensOwner][currentId].amount > 0) {
            uint amountToRemove = ownedTokens[tokensOwner][currentId].amount;

            // Уменьшаем общее количество токенов в стоке.
            decreaseTokensInStock(currentId, amountToRemove);

            // Удаляем информацию о токене у владельца.
            delete ownedTokens[tokensOwner][currentId];

            // Удаляем владельца из списка тех, у кого можно купить этот токен.
            removeCanBePurchasedFrom(currentId, tokensOwner);
        }
        // Удаляем токен из списка токенов, принадлежащих владельцу.
          removeTokensByOwner(currentId, tokensOwner);
    }
    // Очищаем список токенов владельца.
    delete tokensByOwner[tokensOwner];
    emit AllTokensRemoved(tokensOwner);
}

function buy(uint[] memory ids, uint[] memory amounts) public payable {
    uint grandTotal;
    uint count = ids.length;

    require(count == amounts.length, "Arrays must have same length");
    require(msg.value == 0, "Do not send ETH, pay with USDT.");

    for(uint i = 0; i< count; ++i) {
        uint currentId = ids[i];
        uint desiredAmount = amounts[i];

        require(desiredAmount > 0, "Desired amount must be greater than zero");
        require(availableAmount(currentId) >= desiredAmount, "Not enough tokens available");

        uint currentAmount = 0; // Инициализация здесь
        uint j = 0; // Инициализация здесь

        while (currentAmount < desiredAmount) {
            require(j < canBePurchasedFrom[currentId].length, "Not enough sellers");

            address currentOwner = canBePurchasedFrom[currentId][j];
            OwnedToken storage currentlyOwnedToken = ownedTokens[currentOwner][currentId];
            uint currentPrice = currentlyOwnedToken.price;

            uint requiredTokens = desiredAmount - currentAmount;
            uint amountAvailable = min(currentlyOwnedToken.amount, requiredTokens);

            require(currentPrice == ownedTokens[currentOwner][currentId].price,"Price changed!"); 

            uint subTotal = amountAvailable * currentPrice;
            uint feeAmount = (subTotal * fee) / 100;

            require(usdtContract.balanceOf(msg.sender) >= (subTotal + feeAmount), "Insufficient balance");
            require(usdtContract.allowance(msg.sender, address(this)) >= (subTotal + feeAmount), "Insufficient USDT allowance");

            // Переводим полную сумму с комиссией на маркетплейс, если покупатель платит комиссию.
            // Затем маркетплейс отправляет sellerAmount продавцу и удерживает feeAmount.
            usdtContract.transferFrom(msg.sender, address(this), subTotal + feeAmount); 
            grandTotal += subTotal; 

            currentAmount += amountAvailable;

            currentlyOwnedToken.amount -= amountAvailable;
            tokenInStock[currentId] -= amountAvailable;

            tokenContract.safeTransferFrom(currentOwner, msg.sender, currentId, amountAvailable, "");
            // _processFee(payable(currentOwner), subTotal); 
            _processFee(payable(currentOwner), subTotal, feeAmount);
            // Сначала выполняем очистку, если токены продавца закончились
            if (currentlyOwnedToken.amount == 0) {
                removeCanBePurchasedFrom(currentId, currentOwner);
                removeTokensByOwner(currentId, currentOwner);
                removeOwnedTokens(currentId, currentOwner);
                // j не инкрементируется, если происходит swap-and-pop,
                // так как следующий элемент теперь на текущей позиции j.
            } else {
                // Если у продавца остались токены, переходим к следующему индексу для следующей итерации.
                j++;
            }
            // Теперь проверяем, достигли ли мы желаемого количества, и прерываем цикл.
            // Это гарантирует, что очистка произойдет до выхода из цикла.
            if (currentAmount >= desiredAmount) break;
        }
    }
    emit TokensBought(msg.sender, ids, amounts);
}

// функция для подсчета сколько покупателю надо заплатить и нахождение самого дешевого варианта 
function totalPrice(uint[] memory ids, uint[] memory amounts) external view returns (uint price) {
    uint count = ids.length;
    require(count == amounts.length, "Arrays must be the same length");

    price = 0;
    for (uint i = 0; i < count; ++i) {
        uint currentId = ids[i];
        uint desiredAmount = amounts[i];
        require(desiredAmount > 0, "Desired amount must be greater than zero");
        require(availableAmount(currentId) >= desiredAmount, "Not enough tokens available");

        uint currentAmount;
        uint j;

        // Массивы для сбора информации о ценах и количествах каждого продавца
        uint[] memory sellerPrices = new uint[](canBePurchasedFrom[currentId].length);
        uint[] memory availableSellerAmounts = new uint[](canBePurchasedFrom[currentId].length);

        // Заполняем массивы данными о продавцах
        while (j < canBePurchasedFrom[currentId].length) {
            address currentOwner = canBePurchasedFrom[currentId][j];
            OwnedToken storage currentlyOwnedToken = ownedTokens[currentOwner][currentId];
            sellerPrices[j] = currentlyOwnedToken.price;
            availableSellerAmounts[j] = currentlyOwnedToken.amount;
            ++j;
        }
        // Сортируем продавцов по цене (от самой низкой к самой высокой)
        for (uint x = 0; x < sellerPrices.length; ++x) {
            for (uint y = x + 1; y < sellerPrices.length; ++y) {
                if (sellerPrices[x] > sellerPrices[y]) {
                    // Обмен ценами и количествами
                    (sellerPrices[x], sellerPrices[y]) = (sellerPrices[y], sellerPrices[x]);
                    (availableSellerAmounts[x], availableSellerAmounts[y]) = (availableSellerAmounts[y], availableSellerAmounts[x]);
                }
            }
        }

        j = 0; // Снова начинаем с самого дешевого продавца
        while (currentAmount < desiredAmount) {
            require(j < sellerPrices.length, "Not enough sellers for token");

            uint pricePerToken = sellerPrices[j];
            uint availableFromOwner = availableSellerAmounts[j];
            uint tokensToBuy = min(desiredAmount - currentAmount, availableFromOwner);

            price += tokensToBuy * pricePerToken;
            currentAmount += tokensToBuy;
            ++j;
        }
    }
    return price;
}
// Введена функция min для определения минимального значения между необходимым количеством токенов и доступным количеством у текущего владельца
function min(uint a, uint b) pure internal returns (uint) {
    return a < b ? a : b;
}
// сколлько реально продаем токенов 
function availableAmount(uint256 _tokenId) public view returns (uint256) {
    return tokenInStock[_tokenId]; 
}
// можно ли купить у кого нибудь 
function anyOwners(uint256 _tokenId) public view returns (bool) {
    return canBePurchasedFrom[_tokenId].length > 0; 
}
// Функция для расчета и распределения комиссии
// function _processFee(address payable seller, uint amount) internal {
//     address payable marketplaceOwner = payable(admin);
//     uint feeAmount = (amount * fee) / 100; // Комиссия (в процентах)
//     uint sellerAmount = amount - feeAmount; // Сумма, причитающаяся продавцу

//     // Проверка: комиссия не может быть больше суммы продажи
//     require(feeAmount <= amount, "Fee amount cannot exceed the total amount");

//     // Перевод комиссии владельцу маркетплейса
//     bool ownerTransferSuccess = usdtContract.transfer(marketplaceOwner, feeAmount);
//     require(ownerTransferSuccess, "Failed to transfer fee to owner");

//     // Перевод остатка продавцу
//     bool sellerTransferSuccess = usdtContract.transfer(seller, sellerAmount);
//     require(sellerTransferSuccess, "Failed to transfer to seller");

//     // Эмитируем событие для отслеживания переводов
//     emit FeeProcessed(seller, marketplaceOwner, amount, feeAmount, sellerAmount);
// }
            // Новая сигнатура
            function _processFee(address payable seller, uint goodsPrice, uint actualFeeCollected) internal {
                address payable marketplaceOwner = payable(admin);

                // Перевод комиссии владельцу маркетплейса
                bool ownerTransferSuccess = usdtContract.transfer(marketplaceOwner, actualFeeCollected);
                require(ownerTransferSuccess, "Failed to transfer fee to owner");

                // Перевод полной цены товара продавцу
                bool sellerTransferSuccess = usdtContract.transfer(seller, goodsPrice);
                require(sellerTransferSuccess, "Failed to transfer to seller");

                emit FeeProcessed(seller, marketplaceOwner, goodsPrice + actualFeeCollected, actualFeeCollected, goodsPrice);
            }
            

// чтобы убрать чтото из массива 
// здесь мы чтобы не оставлять "дырки" заменяем этот элемент который убираем на последний элетент в массиве 
function removeCanBePurchasedFrom(uint256 currentId, address currentOwner) public { 
    uint256 ownerIndex = indexOfOwner(currentId, currentOwner); // иднекст ищет в массиве нужный элемент 
    canBePurchasedFrom[currentId][ownerIndex] = 
    canBePurchasedFrom[currentId][canBePurchasedFrom[currentId].length -1]; 
    canBePurchasedFrom[currentId].pop();
}
// Уменьшение кол-ва этих токенов и удаляет из mapping если кол-во 0
function decreaseTokensInStock(uint256 currentId, uint256 amount) public {
    require(tokenInStock[currentId] >= amount, "Not enough tokens in stock"); // Проверка, что в наличии достаточно токенов
    tokenInStock[currentId] -= amount;

    // Если токенов больше нет в стоке, удаляем его из списка доступных
    if (tokenInStock[currentId] == 0) {
        delete availableTokenIds[currentId]; // Удаляем токен из mapping
    }
}
function removeOwnedTokens(uint currentId, address currentOwner) public {
    // Эта функция предназначена для полного удаления информации о конкретном токене
    // у конкретного владельца из mapping `ownedTokens`.  После вызова этой функции,
    // `ownedTokens[currentOwner][currentId]` больше не должен содержать никаких данных.

    // Проверяем, действительно ли существует запись о токене у данного владельца.
    // Это дополнительная мера предосторожности, чтобы избежать потенциальных ошибок,
    // хотя в теории, функция должна вызываться только если запись существует.

    if (ownedTokens[currentOwner][currentId].amount > 0 || ownedTokens[currentOwner][currentId].price > 0) {
        // Удаляем запись о токене у владельца.  `delete` в Solidity сбрасывает все
        // поля структуры `OwnedToken` (amount и price) к их значениям по умолчанию (0).
        delete ownedTokens[currentOwner][currentId];
    }
}

function removeTokensByOwner(uint256 currentId, address currentOwner) public {
    uint256 tokenByOwnerIndex = indexOfTokenByOwner(currentOwner, currentId);

    // Проверяем, что токен действительно существует в списке.
    require(tokenByOwnerIndex < tokensByOwner[currentOwner].length, "Token not found in owner's list");

    // Если удаляется не последний элемент, меняем его местами с последним.
    if (tokenByOwnerIndex < tokensByOwner[currentOwner].length - 1) {
        tokensByOwner[currentOwner][tokenByOwnerIndex] = tokensByOwner[currentOwner][tokensByOwner[currentOwner].length - 1];
    }
    // Удаляем последний элемент (теперь дубликат или исходный последний элемент).
    tokensByOwner[currentOwner].pop();
}

function indexOfTokenByOwner(address _owner, uint256 _tokenToSearch) internal view returns (uint256) {
    uint256 length = tokensByOwner[_owner].length; 

    for (uint i = 0; i < length; ++i) {
        if (tokensByOwner[_owner][i] == _tokenToSearch) {
            return i; 
        }
    }
    revert("I cannot find the request element");
}

function indexOfOwner(uint256 _tokenId, address _ownerToSearch) internal view returns (uint256) {
    uint256 length = canBePurchasedFrom[_tokenId].length; 

    for (uint i = 0; i < length; ++i) {
        if (canBePurchasedFrom[_tokenId][i] == _ownerToSearch) {
            return i; 
        }
    }
    revert("I cannot find the request element");
}

function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        tokenURIs[tokenId] = uri;
        emit TokenMetadataUpdated(tokenId, uri);
    }

// Функция для установки категории и флага NFT токена
function setTokenInfo(uint256 tokenId, Category category, bool _isNFT) external onlyOwner {
    tokenInfo[tokenId].category = category;
    tokenInfo[tokenId].isNFT = _isNFT;
}

function getTokens(Category category, bool onlyNFT) external view returns (uint256[] memory) {
    uint256[] memory result = new uint256[](maxTokenId + 1); // Макс. размер, потом обрежем
    uint256 counter = 0;

    // Проходим по всем возможным tokenId от 0 до maxTokenId
    for (uint256 i = 0; i <= maxTokenId; i++) {
        // Проверяем, существует ли токен в принципе (предлагается ли он)
        if (availableTokenIds[i]) {
            TokenInfo storage currentTokenInfo = tokenInfo[i];

            // Проверяем категорию и флаг NFT (если указан)
            if ((category == Category.ALL || currentTokenInfo.category == category) &&
                (!onlyNFT || currentTokenInfo.isNFT)) {
                result[counter] = i;
                counter++;
            }
        }
    }

    // Обрезаем массив до фактического количества элементов
    uint256[] memory finalResult = new uint256[](counter);
    for (uint256 i = 0; i < counter; i++) {
        finalResult[i] = result[i];
    }
    return finalResult;
}
function getTokensByOwner(address _owner) external view returns (uint[] memory) {
    // Возвращает копию массива tokenIds, принадлежащих указанному владельцу.
    return tokensByOwner[_owner];
}
}
