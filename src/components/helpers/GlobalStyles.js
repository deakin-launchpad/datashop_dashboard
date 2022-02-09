import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%'
    },
    body: {
      height: '100%',
      width: '100%'
    },
    '#root': {
      height: '100%',
      width: '100%'
    },
    /* Increase the specificity */
    '.MuiListItemIcon-root':{
      color:'white',
    },
    '.Mui-selected':{
      backgroundColor:'#fff !important',
      borderRight:'3px solid #1CCEF4',

    },
    '.Mui-selected  .MuiListItemText-root':{
      color:'#326EBD'
    },
    '.Mui-selected  .MuiListItemIcon-root':{
      color:'#326EBD'
    }
  }
}));

export const GlobalStyles = () => {
  useStyles();
  return null;
};

