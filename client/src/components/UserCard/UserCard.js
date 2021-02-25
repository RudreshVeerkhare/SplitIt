import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import cx from "classnames";
import CountUp from "react-countup";

import { useAccount, useContract } from "../../context/Web3Context";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "50%",
        padding: "10px",
        marginBottom: "10px",
    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    avatar: {
        backgroundColor: red[500],
    },
    center: {
        textAlign: "center",
        padding: "5px",
    },
    debt: {
        color: "red",
    },
    credit: {
        color: "green",
    },
    debtBorder: {
        borderLeft: "10px solid rgba(255, 0, 0, 0.5)",
    },
    creditBorder: {
        borderLeft: "10px solid rgba(0, 255, 0, 0.5)",
    },
}));

export default function UserCard({ username, address }) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [debt, setDebt] = useState();
    const [credit, setCredit] = useState();
    const [split, setSplit] = useState();

    const account = useAccount();
    const contract = useContract();

    useEffect(() => {
        fetchData();
        console.log("HEEEELLLLLOOO");
    }, [account, contract]);

    const fetchData = async () => {
        try {
            const _debt = await contract.methods
                .getDebtByAcc(account, address)
                .call();
            const _credit = await contract.methods
                .getLendedMoneyByAcc(account, address)
                .call();
            console.log(_debt, _credit);
            console.log(account, address);
            setDebt(_debt);
            setCredit(_credit);
        } catch (err) {
            console.log("Error while fetching");
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const payDebt = async () => {
        try {
            await contract.methods.payDebt(address).send({ from: account });
        } catch (err) {
            console.log("Error while payDebt");
        }
        fetchData();
    };
    const addSplit = async () => {
        try {
            if (isNaN(split)) return;
            await contract.methods
                .addSplit(address, parseInt(split))
                .send({ from: account });
        } catch (err) {
            console.log("Error while payDebt");
        }
        fetchData();
    };

    return (
        <Card
            className={cx(
                classes.root,
                debt > credit ? classes.debtBorder : classes.creditBorder
            )}
        >
            <CardHeader
                title={username}
                subheader={address}
                action={
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Grid container className={classes.center}>
                        <Grid md={6} xs={12}>
                            <Typography variant="h3" className={classes.debt}>
                                <CountUp
                                    end={debt}
                                    duration={1.5}
                                    separator=","
                                    redraw
                                />
                            </Typography>
                            <Typography>Debt</Typography>
                        </Grid>
                        <Grid md={6} xs={12}>
                            <Typography variant="h3" className={classes.credit}>
                                <CountUp
                                    end={credit}
                                    duration={1.5}
                                    separator=","
                                    redraw
                                />
                            </Typography>
                            <Typography>Credit</Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.center}>
                        <Grid md={6} xs={12}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={payDebt}
                            >
                                Pay Debt
                            </Button>
                        </Grid>
                        <Grid md={3} xs={6}>
                            <TextField
                                id="add_split"
                                placeholder="Enter Split Amount"
                                value={split}
                                onChange={(e) => setSplit(e.target.value)}
                            />
                        </Grid>
                        <Grid md={3} xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={addSplit}
                            >
                                Add Split
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    );
}
