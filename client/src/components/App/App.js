import React, { useState, useEffect } from "react";
import { useWeb3, useAccounts, useContract } from "../../context/Web3Context";
import { Cards, SearchUser, Accounts, RegisterModal, Header } from "../index";
import { Typography, InputBase, Grid } from "@material-ui/core";
import styles from "./App.module.css";

const App = () => {
    return (
        <div className={styles.container}>
            <Header />
            <Cards data={{ debt: 10, credit: 100, balance: 50 }} />
            <SearchUser />
            <Accounts />
            <RegisterModal />
        </div>
    );
};
export default App;
