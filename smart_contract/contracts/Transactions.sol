// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract Transactions {
    uint256 transactionCount;

    event Transfer( address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct { // like object in java to make a special data-type for all values in a transaction
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions; // array of type TransferStruct to store all transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1; // updating the transaction count;
        // msg.sender is automatically taken when someone call a function, block.timestamp is also a built-in function;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);// emmitting the event
    }

    function getAllTransactions() public view returns(TransferStruct[] memory){
        return transactions;
    }

    function getTransactionCount() public view returns(uint256) {
        return transactionCount;
    }
}
