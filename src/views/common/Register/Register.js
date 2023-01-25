/***
 *  Created by Sanchit Dang
 ***/
import { useState, useContext } from "react";
import {
  TextField,
  Typography,
  Grid,
  Button,
  Box,
  CardContent,
  Link,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { notify } from "components";
import { Link as RouterLink } from "react-router-dom";
import { DeviceInfoContext } from "contexts/index";
import { API } from "helpers/index";

const useStyles = makeStyles(() =>
  createStyles({
    leftSpan: {
      minHeight: "100vh",
      position: "relative",
      background: `#292E37 url(${
        require("../../../assets/images/bg/authentication_left_bg.png").default
      })`,
      backgroundSize: "100% 100%",
    },
    leftTextPosition: {
      width: "80%",
      position: "absolute",
      margin: "auto",
      left: 0,
      right: 0,
      top: "15%",
      zIndex: 2,
    },
    rightSpan: {
      minHeight: "100vh",
      background: `url(${
        require("../../../assets/images/bg/authentication_bg.png").default
      })`,
      backgroundSize: "100% 100%",
      padding: 40,
    },
  })
);

export const Register = () => {
  const classes = useStyles();
  const { deviceData } = useContext(DeviceInfoContext);
  const [pageHeading] = useState("Sign up to Blocconi");
  const [emailId, setEmailId] = useState("");
  const [countryCode, setCountryCode] = useState("+61");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const role = "1";
  const navigate = useNavigate();
  const register = async () => {
    const response = await API.register({
      deviceData,
      emailId,
      countryCode,
      phoneNumber,
      password,
      firstName,
      lastName,
      role,
    });
    if (response.success) {
      notify("registered Successfully");
      navigate("/login");
    }
  };
  const validationCheck = () => {
    if (
      emailId.length < 0 ||
      password.length < 0 ||
      confirmPassword.length < 0 ||
      firstName.length < 0 ||
      lastName.length < 0 ||
      emailId === "" ||
      password === "" ||
      confirmPassword === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      return notify("Please fill in all the details.");
    }
    let emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailPatternTest = emailPattern.test(emailId);
    if (!emailPatternTest) {
      notify("Email not in proper format");
    }
    if (password !== confirmPassword) {
      return notify("Passwords don't match.");
    }
    if (emailPatternTest) {
      return register();
    }
  };
  let form = (
    <form noValidate>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            autoFocus
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lastName"
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
      </Grid>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        onChange={(e) => setEmailId(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="countryCode"
        label="Country Code"
        name="countryCode"
        autoComplete="countryCode"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="phone"
        label="Phone Number"
        name="phoneNumber"
        autoComplete="phoneNumber"
        onChange={(e) => setPhoneNumber(e.target.value)}
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
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="current-password"
      />
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button
          sx={{ px: 5 }}
          variant="contained"
          color="primary"
          onClick={validationCheck}
        >
          Register
        </Button>
      </Box>
    </form>
  );
  let content = (
    <Box>
      <Grid container>
        <Grid item xs={4} className={classes.leftSpan}>
          <Box className={classes.leftTextPosition}>
            <Typography variant="h3" component="h3" color="white">
              Blocconi
            </Typography>
            <Typography variant="h5" component="h5" color="white">
              Can fill in the relevant function description
            </Typography>
          </Box>
          <Box sx={{ position: "absolute", zIndex: 1, left: 15, bottom: 40 }}>
            <img
              width="95%"
              src={require("../../../assets/images/bg/signUp_pic.png").default}
            />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box className={classes.rightSpan}>
            {/* <img
              width={200}
              src={require("../../../assets/images/logo/logo.png").default}
            /> */}
            <CardContent
              sx={{ display: "flex", flexDirection: "column", p: 4 }}
            >
              <Box
                sx={{
                  mx: 10,
                  my: 8,
                }}
              >
                <Typography color="textPrimary" variant="h5">
                  {pageHeading}
                </Typography>

                <Typography variant="body1">
                  Already a member?{" "}
                  <Link
                    color="#326EBD"
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ mx: 10 }}>{form}</Box>
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
  return content;
};
