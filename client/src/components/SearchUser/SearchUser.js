import React, { useEffect, useState } from "react";
import {
    Typography,
    InputBase,
    Grid,
    TextField,
    makeStyles,
} from "@material-ui/core";
import { UserCard } from "../index";
import { useContract, useAccount, useWeb3 } from "../../context/Web3Context";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: "5px",
    },
    searchBar: {
        width: "50%",
        marginBottom: "15px",
    },
}));

export default () => {
    const [user, setUser] = useState(undefined);
    const [username, setUsername] = useState("");

    const contract = useContract();

    useEffect(() => {
        getUser(username);
    }, [username]);
    const classes = useStyles();

    const getUser = async (username) => {
        try {
            const _addr = await contract.methods.nameAddr(username).call();
            if (_addr == 0) {
                setUser(undefined);
                return;
            }
            setUser({ username: username, address: _addr });
        } catch (err) {
            console.log("error while searching");
        }
    };

    return (
        <>
            <Typography variant="h4">Search Users</Typography>
            <TextField
                placeholder="Enter Username"
                className={classes.searchBar}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {user && (
                <UserCard username={user.username} address={user.address} />
            )}
        </>
    );
};
