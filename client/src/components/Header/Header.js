import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useAccount, useContract } from "../../context/Web3Context";
export default () => {
    const [username, setUsername] = useState();

    const account = useAccount();
    const contract = useContract();

    useEffect(() => {
        fetchUsername();
    }, [account, contract]);

    const fetchUsername = async () => {
        try {
            const _username = await contract.methods.addrName(account).call();
            setUsername(_username);
        } catch (err) {
            console.log("Error while getting username");
        }
    };

    return (
        <Grid
            container
            style={{
                margin: "50px 0 0 0",
                width: "60%",
            }}
            justify="center"
            alignItems="flex-end"
        >
            <Grid item md={4} xs={12} justify="left">
                <Typography variant="h3">{username}</Typography>
            </Grid>
            <Grid item md={6} xs={12} justify="right">
                <Typography color="textSecondary" variant="h6" gutterBottom>
                    {account}
                </Typography>
            </Grid>
        </Grid>
    );
};
