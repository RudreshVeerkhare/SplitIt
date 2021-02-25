import React, { useContext, useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import contractJson from "../contracts/SplitIt.json";

const Web3Context = React.createContext();
const ContactContext = React.createContext();
const AccountsContext = React.createContext();

export const useWeb3 = () => {
    return useContext(Web3Context);
};

export const useContract = () => {
    return useContext(ContactContext);
};
export const useAccount = () => {
    return useContext(AccountsContext);
};

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(undefined);
    const [account, setAccount] = useState();
    const [contract, setContract] = useState();

    useEffect(() => {
        const init = async () => {
            // load data
            const _web3 = await getWeb3();
            const _accounts = await _web3.eth.getAccounts();
            const netId = await _web3.eth.net.getId();
            const _contract = new _web3.eth.Contract(
                contractJson.abi,
                contractJson.networks[netId].address
            );

            // adding listener for account change
            const accChangeListener = (_accounts) => {
                setAccount(_accounts[0]);
            };
            window.ethereum.on("accountsChanged", accChangeListener);

            // saving this to states
            setWeb3(_web3);
            setAccount(_accounts[0]);
            setContract(_contract);
        };

        init();
    }, []);

    return (
        <Web3Context.Provider value={web3}>
            <ContactContext.Provider value={contract}>
                <AccountsContext.Provider value={account}>
                    {children}
                </AccountsContext.Provider>
            </ContactContext.Provider>
        </Web3Context.Provider>
    );
};
