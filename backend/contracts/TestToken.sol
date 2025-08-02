
// // OpenZeppelin Contracts (last updated v5.1.0) (token/ERC1155/ERC1155.sol)

// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

// contract TestToken is ERC1155, ERC1155Burnable {
//     using Strings for uint256; 

//     constructor() ERC1155("http://example.col/") {}

//     function uri(uint id) public view override returns (string memory) {
//         string memory _uri = super.uri(0); 

//         return string.concat(_uri, id.toString()); 
//     }
//     function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
//         _mint(account, id, amount, data); 
//     }
//     function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public {
//         _mintBatch(to, ids, amounts, data); 
//     }
// }
//  SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC1155/ERC1155.sol)

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC1155, ERC1155Burnable, Ownable {
    using Strings for uint256;

    string private _uri;

    constructor(string memory initialUri) ERC1155(initialUri) Ownable(msg.sender) {
        _uri = initialUri;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return string.concat(_uri, id.toString());
    }

    function setURI(string memory newuri) public onlyOwner {
        _uri = newuri;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
}