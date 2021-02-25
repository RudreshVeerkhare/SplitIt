import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
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

export default function RegisterModal() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const account = useAccount();
    const contract = useContract();

    useEffect(() => {
        const isRegistered = async () => {
            try {
                const addr = await contract.methods.addrName(account).call();
                if (addr != 0) {
                    setOpen(false);
                    return;
                }
                setOpen(true);
            } catch (err) {
                console.log("Error in Register Modal");
            }
        };
        isRegistered();
    }, [account, contract]);

    const isUsernameAvailable = async (username) => {
        setLoading(true);
        try {
            const addr = await contract.methods.nameAddr(username).call();
            if (addr != 0) {
                setError(true);
                setLoading(false);
                return;
            }

            // register

            await contract.methods.register(username).send({ from: account });
            setOpen(false);
        } catch (err) {
            console.error("Error while checking for username", err);
        }
        setLoading(false);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (username == "") return;
        isUsernameAvailable(username);
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
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Register
                                </Typography>
                                <Typography color="textSecondary" component="p">
                                    Select Username for Your Address
                                </Typography>
                                <Typography color="textSecondary" component="p">
                                    {account}
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
                                        id="Username"
                                        label="Username"
                                        name="username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                    >
                                        Register
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
