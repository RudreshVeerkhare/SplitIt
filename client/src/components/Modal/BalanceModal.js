import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, MenuItem, FormControl } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { useAccount, useWeb3, useContract } from "../../context/Web3Context";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    formControl: {
        margin: theme.spacing(1),
    },
    image: {
        backgroundRepeat: "no-repeat",
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    paper: {
        margin: theme.spacing(4, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function RegisterModal({ open, setOpen, refreshData }) {
    const classes = useStyles();
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tType, setTType] = useState("deposite");

    const account = useAccount();
    const contract = useContract();

    const deposite = async (_amount) => {
        setLoading(true);
        try {
            await contract.methods
                .depositeMoney()
                .send({ from: account, value: _amount });
            setOpen(false);
        } catch (err) {
            console.error("Error while depositing", err);
        }
        setLoading(false);
        refreshData();
    };

    const withdraw = async (_amount) => {
        setLoading(true);
        try {
            await contract.methods
                .withdrawMoney(_amount)
                .send({ from: account });
            setOpen(false);
        } catch (err) {
            console.error("Error while withdrawing", err);
        }
        setLoading(false);
        refreshData();
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (isNaN(amount)) {
            // check if not a number
            setError(true);
            return;
        }
        if (tType === "deposite") {
            deposite(parseInt(amount));
        } else if (tType === "withdraw") {
            withdraw(parseInt(amount));
        }
    };

    return (
        <div>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                className={classes.modal}
                closeAfterTransition
                open={open}
                onClose={(e) => setOpen(false)}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    {loading ? (
                        <Typography variant="h3">Loading...</Typography>
                    ) : (
                        <Grid
                            item
                            xs={10}
                            sm={8}
                            md={4}
                            component={Paper}
                            elevation={6}
                            square
                        >
                            <div className={classes.paper}>
                                <Typography component="h1" variant="h5">
                                    Account Balance
                                </Typography>
                                <Typography color="textSecondary" component="p">
                                    Enter amount to Deposite/Withdraw
                                </Typography>
                                <form
                                    className={classes.form}
                                    onSubmit={onSubmitHandler}
                                >
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        error={error}
                                        fullWidth
                                        id="amount"
                                        label="Amount"
                                        name="amount"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                    />
                                    <FormControl
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="demo-simple-select-label">
                                            Action
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={tType}
                                            name="user_type"
                                            onChange={(e) =>
                                                setTType(e.target.value)
                                            }
                                        >
                                            <MenuItem value="deposite">
                                                Deposite
                                            </MenuItem>
                                            <MenuItem value="withdraw">
                                                Withdraw
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                    >
                                        Confirm
                                    </Button>
                                </form>
                            </div>
                        </Grid>
                    )}
                </Fade>
            </Modal>
        </div>
    );
}
