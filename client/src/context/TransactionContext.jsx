import React, { useEffect, useState} from  'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {

    // const [connectedAccount, setConnectedAccount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');

    const [formData, setFormData] = useState({ addressTo: '', amount:'', keyword:'', message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const getAllTransactions = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
              }
            else{
                alert("Please install Metamask!")
            }
            const transactionContract = getEthereumContract();
            const availabeTransactions = await transactionContract.getAllTransactions();
            const structuredTransactions = availabeTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber()  * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10**18)
            }))
            console.log(structuredTransactions);
            setTransactionCount(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
              }
            else{
                alert("Please install Metamask!")
            }
    
            const accounts = await ethereum.request({ method: 'eth_accounts' });
    
            if(accounts.length){
                setAccountAddress(accounts[0]);
    
                getAllTransactions();
            }
            else{
                console.log("No Accounts found!");
            }  
        } catch (error) {
            console.log(error);
            setIsConnected(false);
            throw new Error("No Ethereum Object"); 
        }
        
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);
            setIsConnected(false);
            throw new Error("No Ethereum Object"); 
        }
    }

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
              }
            else{
                alert("Please install Metamask!")
            }
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        // setCurrentAccount(accounts[0]);
        setAccountAddress(accounts[0]);
        setIsConnected(true);
        console.log(accounts);
        } catch (error) {
            console.log(error);
            setIsConnected(false);
            throw new Error("No Ethereum Object");
        }
    }

    const sendTransaction = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
              }
            else{
                alert("Please install Metamask!")
            }

            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: accountAddress,
                    to: addressTo,
                    gas: '0x5028', // 21000 Gwei , a sub-unit of ETH
                    value: parsedAmount._hex, // 0.00001 ETH 
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();setIsLoading(true);
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = transactionContract.getTransactionCount();
            setTransactionCount(Number(transactionCount));

            window.location.reload();

        } catch (error) {
            console.log(error);
            setIsConnected(false);
            throw new Error("No Ethereum Object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    },[]);

    return(
        <TransactionContext.Provider value={{ connectWallet, accountAddress, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}