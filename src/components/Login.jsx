import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
//  ******************************************************************************************  //

import React, { useEffect } from "react";
import useLoginForm from "../hooks/CustomHooks";
import { socket } from "../redux/middleWares";
import { toast, ToastContainer } from "react-toastify";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="http://fizmasoft.uz/">
        FizmaSoft
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Login(props) {
  const classes = useStyles();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      props.history.push("/dashboard");
    }
    if (
      props.history.location.state !== undefined &&
      props.history.location.state.err === 401
    ) {
      localStorage.removeItem("token");
      toast.error("Сизнинг сессиянгиз тугади. Илтимос, кайтадан киринг!");
    }
  }, []);

  const auth = props => {
    const { username, password } = inputs;
    socket.emit("login", { username, password });
    socket.once("login", data => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        props.history.push("/dashboard");
      } else {
        toast.error("Бундай фойдаланувчи мавжуд эмас.");
      }
    });
    socket.once("err", data => {
      console.log(data);
    });
  };

  const { inputs, handleInputChange, handleSubmit } = useLoginForm(props, auth);

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer position="top-center" />
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar} src={"/favicon.ico"}></Avatar> */}
        <Typography component="h1" variant="h5">
          Тизимга кириш
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoComplete="off"
            autoFocus
            onChange={handleInputChange}
            value={inputs.username || ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={handleInputChange}
            value={inputs.password || ""}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Кириш
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
