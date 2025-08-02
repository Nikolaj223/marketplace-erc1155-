
// pragma solidity ^0.8.0;

// contract TestERC20 {
//     string public name;
//     string public symbol;
//     uint8 public decimals;
//     uint256 public totalSupply;

//     mapping(address => uint256) public balanceOf;
//     mapping(address => mapping(address => uint256)) public allowance;

//     event Transfer(address indexed from, address indexed to, uint256 value);
//     event Approval(address indexed owner, address indexed spender, uint256 value);

//     constructor(string memory _name, string memory _symbol, uint8 _decimals) {
//         name = _name;
//         symbol = _symbol;
//         decimals = _decimals;
//     }

//     function transfer(address _to, uint256 _value) public returns (bool) {
//         require(balanceOf[msg.sender] >= _value, "Insufficient balance");
//         balanceOf[msg.sender] -= _value;
//         balanceOf[_to] += _value;
//         emit Transfer(msg.sender, _to, _value);
//         return true;
//     }

//     function approve(address _spender, uint256 _value) public returns (bool) {
//         allowance[msg.sender][_spender] = _value;
//         emit Approval(msg.sender, _spender, _value);
//         return true;
//     }

//     function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
//         require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
//         require(balanceOf[_from] >= _value, "Insufficient balance");
//         balanceOf[_from] -= _value;
//         balanceOf[_to] += _value;
//         allowance[_from][msg.sender] -= _value;
//         emit Transfer(_from, _to, _value);
//         return true;
//     }

//     function mint(address _to, uint256 _amount) public {
//         balanceOf[_to] += _amount;
//         totalSupply += _amount;
//         emit Transfer(address(0), _to, _amount);
//     }
//     function burn(address _from, uint256 _amount) public {
//         require(balanceOf[_from] >= _amount, "Insufficient balance");
//         balanceOf[_from] -= _amount;
//         totalSupply -= _amount;
//         emit Transfer(_from, address(0), _amount);
//     }
// }
//  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        require(balanceOf[_from] >= _value, "Insufficient balance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value; // Важно: Уменьшаем allowance!

        emit Transfer(_from, _to, _value);
        return true;
    }

    function mint(address _to, uint256 _amount) public {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
        emit Transfer(address(0), _to, _amount);
    }
    function burn(address _from, uint256 _amount) public {
        require(balanceOf[_from] >= _amount, "Insufficient balance");
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
        emit Transfer(_from, address(0), _amount);
    }
    // Функция для проверки allowance (полезно для отладки)
    function checkAllowance(address _owner, address _spender) public view returns (uint256) {
        return allowance[_owner][_spender];
    }
}