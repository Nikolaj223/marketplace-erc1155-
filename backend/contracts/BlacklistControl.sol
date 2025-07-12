//  SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BlacklistControl {

    address public admin; // Адрес администратора
    mapping(address => bool) public blacklisted; // Маппинг для хранения адресов в черном списке

    event UserBlacklisted(address user); // Событие при добавлении пользователя в черный список
    event UserRemovedFromBlacklist(address user); // Событие при удалении пользователя из черного списка

    // Модификатор, проверяющий, что вызывающий функцию - администратор
    modifier onlyAdmin {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Конструктор, устанавливающий администратора при развертывании контракта
    constructor() {
        admin = msg.sender;
    }

    // Функция для добавления пользователя в черный список (только для администратора)
    function blacklistUser(address _user) external onlyAdmin {
        blacklisted[_user] = true;
        emit UserBlacklisted(_user);
    }

    // Функция для удаления пользователя из черного списка (только для администратора)
    function removeFromBlacklist(address _user) external onlyAdmin {
        blacklisted[_user] = false;
        emit UserRemovedFromBlacklist(_user);
    }

    // Функция для проверки, находится ли пользователь в черном списке
    function isBlacklisted(address _user) public view returns (bool) {
        return blacklisted[_user];
    }

}