/* eslint-disable indent */
import { useContext } from "react";
import { useMediaQuery } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Header, BottomNavToolbar } from "components";
import { LayoutContext } from "contexts";
import PropTypes from "prop-types";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      padding: "30px 30px 0px 30px",
      height: "100vh",
      background: "#F2F6FE",
    },
    header: {
      display: "flex",
      flex: "0 0 auto",
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: "100%",
      overflow: "auto",
    },
    mobileContent: {
      "-webkit-overflow-scrolling": "touch",
      flexGrow: 1,
      height: "100%",
      overflowY: "scroll",
      overflowX: "hidden",
    },
    iOSPadding: {
      height: iOS ? theme.spacing(2) : 0,
    },
  })
);

export const Layout = (props) => {
  const { layoutConfiguration } = useContext(LayoutContext);
  const classes = useStyles();

  const headerRenderStatus = () => {
    if (isItDesktop) return layoutConfiguration.header.visibleOnDesktop;
    else return layoutConfiguration.header.visibleOnMobile;
  };

  let isItDesktop = useMediaQuery("(min-width:600px) and (min-height:600px)");
  let content = (
    <div className={classes.root}>
      {headerRenderStatus() && <Header />}
      <main className={isItDesktop ? classes.content : classes.mobileContent}>
        <div
          className={
            isItDesktop
              ? classes.appBarSpacer
              : headerRenderStatus()
              ? classes.appBarSpacer
              : null
          }
        />
        {props.children}
        <div
          className={
            isItDesktop
              ? null
              : layoutConfiguration.bottomMobileNavigation
              ? classes.appBarSpacer
              : null
          }
        />
        <div className={classes.iOSPadding} />
      </main>
      {isItDesktop ? null : layoutConfiguration.bottomMobileNavigation ? (
        <BottomNavToolbar />
      ) : null}
    </div>
  );
  return content;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
