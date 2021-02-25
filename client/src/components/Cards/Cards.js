import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Link } from "@material-ui/core";
import { useContract, useAccount, useWeb3 } from "../../context/Web3Context";
import { BalanceModal } from "../index";
import CountUp from "react-countup";
import cx from "classnames";

import styles from "./Cards.module.css";

const Cards = () => {
    const [balance, setBalance] = useState(0);
    const [debt, setDebt] = useState(0);
    const [credit, setCredit] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const web3 = useWeb3();
    const contract = useContract();
    const account = useAccount();

    useEffect(() => {
        fetchData();
    }, [account, contract]);

    const fetchData = async () => {
        try {
            // get data
            const _balProm = contract.methods
                .getBalance()
                .call({ from: account });
            const _debtProm = contract.methods
                .getTotalDebtMoney()
                .call({ from: account });
            const _creditProm = contract.methods
                .getTotalLendedMoney()
                .call({ from: account });

            const [_bal, _debt, _credit] = await Promise.all([
                _balProm,
                _debtProm,
                _creditProm,
            ]);
            setBalance(_bal);
            setDebt(_debt);
            setCredit(_credit);
        } catch (err) {
            console.error("Error in Cards.js", err);
        }
    };

    return (
        <div className={styles.container}>
            <Grid container spacing={3} justify="center">
                <Grid
                    item
                    component={Card}
                    xs={12}
                    md={3}
                    className={cx(styles.card, styles.infected)}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            component="h2"
                            color="textSecondary"
                            gutterBottom
                        >
                            Debt
                        </Typography>
                        <Typography varient="h5">
                            <CountUp
                                start={0}
                                end={debt}
                                duration={1.5}
                                separator=","
                            />{" "}
                            Wei
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {new Date().toDateString()}
                        </Typography>
                        <Typography varient="body2">
                            Total amount you have to pay
                        </Typography>
                    </CardContent>
                </Grid>

                <Grid
                    item
                    component={Card}
                    xs={12}
                    md={3}
                    className={cx(styles.card, styles.recovered)}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            component="h2"
                            color="textSecondary"
                            gutterBottom
                        >
                            Credit
                        </Typography>
                        <Typography varient="h5">
                            <CountUp
                                start={0}
                                end={credit}
                                duration={1.5}
                                separator=","
                            />{" "}
                            Wei
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {new Date().toDateString()}
                        </Typography>
                        <Typography varient="body2">
                            Total amount you have{" "}
                        </Typography>
                    </CardContent>
                </Grid>

                <Grid
                    item
                    component={Card}
                    xs={12}
                    md={3}
                    className={cx(styles.card, styles.deaths)}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            component="h2"
                            color="textSecondary"
                            gutterBottom
                        >
                            Balance
                        </Typography>
                        <Typography varient="h5">
                            <CountUp
                                start={0}
                                end={balance}
                                duration={1.5}
                                separator=","
                            />{" "}
                            Wei
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {new Date().toDateString()}
                        </Typography>
                        <Typography gutterBottom>Account Balance</Typography>
                        <Link
                            color="primary"
                            onClick={(e) => {
                                setModalOpen(true);
                            }}
                        >
                            Add/Withdraw Balance
                        </Link>
                    </CardContent>
                </Grid>
            </Grid>
            <BalanceModal
                open={modalOpen}
                setOpen={setModalOpen}
                refreshData={fetchData}
            />
        </div>
    );
};

export default Cards;
