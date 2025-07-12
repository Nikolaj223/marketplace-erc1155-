//  SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC1155/ERC1155.sol)

pragma solidity ^0.8.20;

import {BlacklistControl} from "./BlacklistControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Импорт IERC20 для USDT


contract Marketplace  is BlacklistControl, Ownable {
    uint public fee = 3;
    IERC1155 public tokenContract; 
    IERC20 public usdtContract; 

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

mapping(address owner => mapping (uint tokenId => OwnedToken)) public ownedTokens;  //предложение продавца 

mapping (address owner => uint[] tokenIds) public tokensByOwner; //кол-во токена у каждого продавца 

mapping (uint tokenId => uint totalAmount) public tokenInStock; // сколько ввсего таких токнов можно купить у всех владельцев 

mapping (uint tokenId => address[] owners) public canBePurchasedFrom; // все адреса у которых есть конкретный токен 

mapping(uint256 => string) public tokenURIs;

mapping(uint256 => TokenInfo) public tokenInfo;

uint[] public availableTokenIds; // все что предлагает маркет плэйс 
 
   constructor(address _tokenContract, address _admin,  address _usdtContract) Ownable(msg.sender){ // Вызываем конструктор Ownable с адресом владельца (развертывающий контракт)
        tokenContract = IERC1155(_tokenContract);
        admin = _admin;
        usdtContract = IERC20(_usdtContract);
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
// Функция для получения токенов по категории и типу (NFT/обычный)
function getTokens(Category category, bool onlyNFT) external view returns (uint256[] memory) {
    uint256[] memory result = new uint256[](availableTokenIds.length);
    uint256 counter = 0;

    for (uint256 i = 0; i < availableTokenIds.length; i++) {
        uint256 tokenId = availableTokenIds[i];
        TokenInfo storage currentTokenInfo = tokenInfo[tokenId];

        // Проверяем категорию и флаг NFT (если указан)
        if ((category == Category.ALL || currentTokenInfo.category == category) &&
            (!onlyNFT || currentTokenInfo.isNFT)) {
            result[counter] = tokenId;
            counter++;
        }
    }
    // Обрезаем массив до фактического количества элементов
    uint256[] memory finalResult = new uint256[](counter);
    for (uint256 i = 0; i < counter; i++) {
        finalResult[i] = result[i];
    }
    return finalResult;
}

// для выставления на продажу сразу много id
function addTokens(uint[] memory ids, uint[] memory amounts, uint[] memory prices) 
external {
    address tokensOwner = msg.sender; 
    require(tokenContract.isApprovedForAll(tokensOwner, address(this)), "Approval needed");
    require(!blacklisted[msg.sender], "You are blacklisted.");

    uint count = ids.length; 

    require(count == amounts.length && count == prices.length, "Arrays must be same length"); // все массивы должны иметь одинаковую длину 
    
    for(uint i = 0; i< count; ++i) {
    
        uint currentId = ids[i]; 
        uint currentBalance = tokenContract.balanceOf(tokensOwner, currentId);
        uint currentAmount = amounts[i]; 

        require(currentBalance >= currentAmount); 
        uint currentPrice = prices[i]; 
        require(currentPrice > 0); 
// проверка есть ли вообще этот токен на платформе, чтобы каждый раз не добавлять его 
if (tokenInStock[currentId] ==0 ) {
    availableTokenIds.push(currentId); 
}
tokenInStock[currentId] += currentAmount; 
OwnedToken storage currentOwnedToken= ownedTokens[tokensOwner][currentId]; 
 
if(currentOwnedToken.price == 0 && currentOwnedToken.amount == 0){
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
    function decreaseAmount(uint tokenId, uint amountToDecrease) external {
        require(!blacklisted[msg.sender], "You are blacklisted.");
        require(ownedTokens[msg.sender][tokenId].amount >= amountToDecrease, "Not enough tokens to decrease");
        ownedTokens[msg.sender][tokenId].amount -= amountToDecrease;
        tokenInStock[tokenId] -= amountToDecrease;
        emit AmountDecreased(msg.sender, tokenId, amountToDecrease);
    }
function removeAllTokens() external {
    require(!blacklisted[msg.sender], "You are blacklisted.");
    address tokensOwner = msg.sender; 
    uint totalTokensNum = tokensByOwner[tokensOwner].length; 
   
    for(uint i = 0; i < totalTokensNum; ++i) {
        uint currentId = tokensByOwner[tokensOwner][i]; 
        
        OwnedToken storage currentToken = ownedTokens[tokensOwner][currentId]; 
// в продаже этого токена стало меньше и на какое то кол-во 
        decreaseTokensInStock(currentId, currentToken.amount); 
        removeCanBePurchasedFrom(currentId, tokensOwner); 
        removeOwnedTokens(currentId, tokensOwner); 
    }
    delete tokensByOwner[tokensOwner]; 
    emit AllTokensRemoved(tokensOwner); 
}

// процесс покупки 
function buy(uint[] memory ids, uint[] memory amounts) external payable {
 
    uint grandTotal = 0;
    uint count = ids.length; 
    require(count == amounts.length, "Arrays must have same length"); 

// Переводим USDT с кошелька покупателя на контракт маркетплейса
    usdtContract.transferFrom(msg.sender, address(this), grandTotal);

    for(uint i = 0; i< count; ++i) {
        uint currentId = ids[i]; // токен который хочет купить
        uint desiredAmount = amounts[i]; // кол-во токенов 
        require(desiredAmount > 0, "Desired amount must be greater than zero");
        require(availableAmount(currentId) >= desiredAmount, "Not enough tokens available"); 
// цикл который будет бродить по владельцам и суммировать токены 
uint currentAmount = 0; 
uint j = 0; 
while (currentAmount < desiredAmount) {
    require(j < canBePurchasedFrom[currentId].length, "Not enough sellers");

    bool allTokensBought; 

    address currentOwner = canBePurchasedFrom[currentId][j]; 
    OwnedToken storage currentlyOwnedToken = ownedTokens[currentOwner][currentId]; // сколько токенов,по какой цена (в первом меппинге информация)
   
uint requiredTokens = desiredAmount - currentAmount; // определить хватает ли у владельца токенов 
// сколько можем реально взять 
uint amountAvailable;
uint currentPrice = currentlyOwnedToken.price; 
require(currentPrice == ownedTokens[currentOwner][currentId].price,"Price changed!"); // Проверка цены
// набрали или не набрали нужное кол-во 
if (currentlyOwnedToken.amount > requiredTokens) {
    amountAvailable = requiredTokens; 
    currentlyOwnedToken.amount -= requiredTokens; 
}else {
    // случай когда покупаем сразу все токены этого владельца (<=) 
    amountAvailable = currentlyOwnedToken.amount; 

    removeCanBePurchasedFrom(currentId, currentOwner); 
    removeTokensByOwner(currentId, currentOwner); 
    removeOwnedTokens(currentId, currentOwner); 

    allTokensBought = true; 
}
currentAmount += amountAvailable; 

decreaseTokensInStock(currentId, amountAvailable); // снижается кол-во токенов с продажи на величину второго аргумента сколько купили 
 
uint subTotal = amountAvailable * currentPrice; // промежуточная цена за токены 

tokenContract.safeTransferFrom(currentOwner, msg.sender, currentId, amountAvailable, ""); 

_processFee(payable(currentOwner), subTotal); // Вызываем функцию для обработки комиссии и перевода средств

grandTotal += subTotal; 

// если будет просто ++j и мы совершим удалениие одного из продавцов, а по моей логике его место займет последний продавец
// а j уже будет не 0 а 1 и мы пропутсим этого продавца 
//  то есть надо сделать так чтобы j увелич только когда мы никого не удаляем 
// ++j только когда не все токены купили 
if (!allTokensBought) ++j;  
}
}
require(grandTotal == msg.value, "Incorrect amount sent");
emit TokensBought(msg.sender, ids, amounts);
}
// Функция для расчета и распределения комиссии
function _processFee(address payable seller, uint amount) internal {
    address payable marketplaceOwner = payable(admin);
    uint feeAmount = (amount * fee) / 100; // Используем значение fee из контракта
    uint sellerAmount = amount - feeAmount;
    usdtContract.transfer(marketplaceOwner, feeAmount);// Отправляем комиссию владельцу маркетплейса
    usdtContract.transfer(seller, sellerAmount);// Отправляем остаток продавцу
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

        uint currentAmount = 0;
        uint j = 0;

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

// чтобы убрать чтото из массива 
// здесь мы чтобы не оставлять "дырки" заменяем этот элемент который убираем на последний элетент в массиве 
function removeCanBePurchasedFrom(uint256 currentId, address currentOwner) private { 
    uint256 ownerIndex = indexOfOwner(currentId, currentOwner); // иднекст ищет в массиве нужный элемент 
    canBePurchasedFrom[currentId][ownerIndex] = 
    canBePurchasedFrom[currentId][canBePurchasedFrom[currentId].length -1]; 
    canBePurchasedFrom[currentId].pop();
}

// уменьшение кол-ва этих токенов и удаляет все тела из масиива 
function  decreaseTokensInStock(uint256 currentId, uint256 amount) private {
    require(tokenInStock[currentId] >= amount, "Not enough tokens in stock"); // Проверка, что в наличии достаточно токенов
    tokenInStock[currentId] -= amount; 

    if (tokenInStock[currentId] == 0) {
        uint256 index =  indexOfTokenId(currentId); 
        availableTokenIds[index] = availableTokenIds[availableTokenIds.length - 1]; 
        availableTokenIds.pop(); 
    }
}

function indexOfTokenId(uint256 _searchFor) internal view returns (uint256) {
    uint256 length = availableTokenIds.length; 
    for (uint256 i = 0; i < length; ++i) {
        if (availableTokenIds[i] == _searchFor) {
            return i; 
        }
    }
      return length; // Возвращаем длину массива, если элемент не найден (значит, его нет)

}
function removeOwnedTokens(uint currentId, address currentOwner) private {
    delete ownedTokens[currentOwner][currentId]; 
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
function removeTokensByOwner(uint256 currentId, address currentOwner) private {
    uint256 tokenByOwnerIndex = indexOfTokenByOwner(currentOwner, currentId);
    tokensByOwner[currentOwner][tokenByOwnerIndex] = 
    tokensByOwner[currentOwner][tokensByOwner[currentOwner].length - 1]; 
    tokensByOwner[currentOwner].pop();

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
// сколлько реально продаем токенов 
function availableAmount(uint256 _tokenId) public view returns (uint256) {
    return tokenInStock[_tokenId]; 
}
// можно ли купить у кого нибудь 
function anyOwners(uint256 _tokenId) public view returns (bool) {
    return canBePurchasedFrom[_tokenId].length > 0; 
}
}