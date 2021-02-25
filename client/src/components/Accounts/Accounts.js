import React, { useEffect, useState } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { UserCard } from "../index";
import { useAccount, useContract } from "../../context/Web3Context";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "15px",
    },
}));

export default () => {
    const classes = useStyles();
    const [accounts, setAccounts] = useState([]);

    const account = useAccount();
    const contract = useContract();

    useEffect(() => {
        fetchAccounts();
    }, [account, contract]);

    const fetchAccounts = async () => {
        try {
            const _accounts = await contract.methods.getAccounts().call();
            const _users = [];
            for (let addr of _accounts) {
                const _debt = await contract.methods
                    .getDebtByAcc(account, addr)
                    .call();
                const _credit = await contract.methods
                    .getLendedMoneyByAcc(account, addr)
                    .call();

                if (_debt == 0 && _credit == 0) continue;

                _users.push({
                    username: await contract.methods.addrName(addr).call(),
                    address: addr,
                });
            }
            setAccounts(_users);
        } catch (err) {
            console.log("Error while fetching accounts");
        }
    };

    return (
        <>
            <Typography variant="h4" gutterBottom className={classes.root}>
                Accounts
            </Typography>
            {accounts.map((acc) => (
                <UserCard
                    key={acc.address}
                    username={acc.username}
                    address={acc.address}
                />
            ))}
        </>
    );
};
