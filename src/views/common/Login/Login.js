/***
 *  Created by Sanchit Dang
 ***/
import { useState, useContext, useCallback } from "react";
import { Typography, Box, CardContent, Link, Grid } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { LoginContext, DeviceInfoContext, LayoutContext } from "contexts";
import { LoginForm, SsoLogin } from "components";
import { API } from "helpers";
import { ConnectionConfig } from "constants/index";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(() =>
  createStyles({
    leftSpan: {
      height: "100vh",
      position: "relative",
      background: `#326EBD url(${
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
      height: "100vh",
      background: `url(${
        require("../../../assets/images/bg/authentication_bg.png").default
      })`,
      backgroundSize: "100% 100%",
      padding: 40,
    },
  })
);

export const Login = () => {
  const classes = useStyles();
  const [pageHeading] = useState("Sign in to Blocconi");
  const { setAccessToken } = useContext(LoginContext);
  const { deviceUUID, deviceName } = useContext(DeviceInfoContext);
  const { setCurrentUserRole } = useContext(LayoutContext);

  const performLogin = useCallback(
    async (loginValues) => {
      if (ConnectionConfig.bypassBackend) {
        setAccessToken("dummyToken");
      } else {
        let details = {
          ...loginValues,
          deviceData: {
            deviceType: "WEB",
            deviceName: deviceName,
            deviceUUID: deviceUUID,
          },
        };
        return API.login(details);
      }
    },
    [setAccessToken, deviceUUID, deviceName]
  );

  const getUserRole = useCallback(async () => {
    const response = await API.getUserRole();
    if (response.success) {
      setCurrentUserRole(response.data);
      return true;
    } else return false;
  }, [setCurrentUserRole]);

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
              src={require("../../../assets/images/bg/login_pic.png").default}
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
                  mt: 10,
                  mb: 3,
                }}
              >
                <Typography color="textPrimary" variant="h5">
                  {pageHeading}
                </Typography>
                <Typography variant="body1">
                  Not a member?{" "}
                  <Link
                    color="#326EBD"
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                  >
                    Sign up
                  </Link>{" "}
                  now
                </Typography>
              </Box>
              <Box sx={{ mx: 10 }}>
                <LoginForm login={performLogin} onSuccess={getUserRole} />
              </Box>
              {ConnectionConfig.useDeakinSSO && (
                <Box sx={{ mt: 2 }}>
                  <SsoLogin />
                </Box>
              )}
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
  return content;
};
