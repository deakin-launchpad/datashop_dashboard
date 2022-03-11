import  {useState} from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Grid,Button} from '@mui/material';
import { makeStyles, createStyles,styled } from '@mui/styles';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import MobileStepper from '@mui/material/MobileStepper';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../Logo/logo';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
 
const useStyles = makeStyles(() => createStyles({
  leftSpan:{
    height: '100vh',
    position:'relative',
  },
  leftTextPosition:{
    width:'70%',
    position:'absolute',
    margin:'auto',
    left:130,
    right:0,
    top:'30%',
    zIndex:2
  },
  rightSpan:{
    width:600,  
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    height: '100vh',
  }
}));
const images = [
  {
    label: 'DataShop',
    imgPath:
    require('../../../assets/images/bg/landing_bg.png').default,
  },
  {
    label: 'DataShop',
    imgPath:
    require('../../../assets/images/bg/login_pic.png').default,
  },
  {
    label: 'DataShop',
    imgPath:
    require('../../../assets/images/bg/signUp_pic.png').default,
  },
];
export const Landing = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const SignUpButton = styled(Button)(() => ({
    color: 'white',
    backgroundColor:'#292E37',
    '&:hover': {
      backgroundColor:'#515762',
    },
  }));
  const maxSteps = images.length;
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  let content = (
    <Box>
      <Grid container>
        <Grid item xs={5} className={classes.leftSpan}>
          <Box sx={{mt:6,ml:6}}>
            <Logo name='DataShop'></Logo>
          </Box>  
          <Box className={classes.leftTextPosition}>
            <Typography variant="h2"  color="#41425B" >Innovative Data analysis</Typography>
            <Typography variant="body1"  color="#939393">Descriptions of data shop content such as features</Typography>
            <Box sx={{mt:3}}>
              <Button onClick={()=> navigate('/login')} sx={{borderRadius:10,px:4,mr:3}} variant="contained" color="primary">Sign In</Button>
              <SignUpButton onClick={()=> navigate('/register')} sx={{borderRadius:10,px:4}}>Sign Up</SignUpButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={7} display="flex" justifyContent="center">  
          <Box className={classes.rightSpan}>
            <AutoPlaySwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {images.map((step, index) => (
                <Box key={step.label}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <Box
                      component="img"
                      sx={{
                        height: 600,
                        display: 'block',
                        maxWidth: 600,
                        overflow: 'hidden',
                        width: '100%',
                      }}
                      src={step.imgPath}
                      alt={step.label}
                    />
                  ) : null}
                </Box>
              ))}
            </AutoPlaySwipeableViews>
            
            <MobileStepper
              sx={{ 
                zIndex:999,
                display: 'flex',
                mt:8,
                justifyContent: 'center',
                background: 'none'}}
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
  return content;
};
 