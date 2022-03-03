import { useState, useContext } from 'react';
import clsx from 'clsx';
import { Drawer, Divider, IconButton,Box,AppBar,Toolbar,Typography,useMediaQuery ,Tooltip,Menu,MenuItem} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { LayoutContext } from 'contexts';
import { SideMenuItems } from './SideMenuItems';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';

export const Header = () => {
  let isItDesktop = useMediaQuery('(min-width:600px) and (min-height:600px)');
  const drawerWidth = 240;
  const useStyles = makeStyles(theme => createStyles({
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth+60}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      height:'calc(100% - 30px)',
      background: `#326EBD url(${require('../../assets/images/bg/menu_bg.png').default}) 0 100% no-repeat`,
      borderRadius:20,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(6),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7.9),
      },
    },
    container: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(4),
      paddingLeft: theme.spacing(6)
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    button: {
      margin: theme.spacing(1),
    }
  }));
  const {pageTitle,headerElements,layoutConfiguration } = useContext(LayoutContext);
  const [open, setOpen] = useState(isItDesktop ? (layoutConfiguration.sideMenu.default === 'open' ? true : false) : false);
  const [anchorEl, setAnchorEl] = useState(null);
  const walletOpen = Boolean(anchorEl);
  const handleWalletClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleWalletClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  let content = (
    <>
      <AppBar elevation={layoutConfiguration.theme !== undefined ? layoutConfiguration.theme.appBarElevation !== undefined ? layoutConfiguration.theme.appBarElevation : 0 : 0} position={layoutConfiguration.sideMenu.permanent ? 'fixed' : 'absolute'} className={layoutConfiguration.sideMenu.permanent ? (isItDesktop ? classes.appBarShift : classes.appBar) : clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar  className={classes.toolbar}>
          {isItDesktop ? layoutConfiguration.sideMenu.permanent ? null : < IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton> : null}
          {
            headerElements !== null ? headerElements :
              <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
                {pageTitle}
              </Typography>
          }
          <Tooltip title="Wallet">
            <IconButton
              onClick={handleWalletClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={walletOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={walletOpen ? 'true' : undefined}
            >
              <AccountBalanceWalletIcon />
              <Typography>$ 0</Typography>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={walletOpen}
            onClose={handleWalletClose}
            onClick={handleWalletClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <AddCardIcon fontSize="small" sx={{mr:1}} />
             Add funds
            </MenuItem>
            <Divider />
            <MenuItem>
               balance: $0
            </MenuItem>
            <MenuItem>
               pending: $0
            </MenuItem>
            <MenuItem>
               gain: $0
            </MenuItem>
            <MenuItem>
               spend: $0
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {
        isItDesktop ? <Drawer 
          variant="permanent"
          classes={{
            paper: layoutConfiguration.sideMenu.permanent ? classes.drawerPaper : clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={layoutConfiguration.sideMenu.permanent ? true : open}
        >
          <div className={classes.toolbarIcon} >
            {layoutConfiguration.sideMenu.permanent ?<Box sx={{textAlign:'center',pt:2}}> <img src={require('../../assets/images/logo/logo_white.png').default} width="70%" /> < Divider color="white" sx={{opacity:.5, mt:1}} /> </Box> : <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>}
          </div>
          {!layoutConfiguration.sideMenu.permanent && < Divider />}
          <SideMenuItems />
        </Drawer> : null
      }
    </>
  );
  return content;
};
