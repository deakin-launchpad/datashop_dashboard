import PropTypes from 'prop-types';
import { Box,Typography } from '@mui/material';

export const Logo = (props) => {
  return (
    <Box display="flex" alignItems="center">
      <img width={50} height={50} src={require('../../../assets/images/logo/logo_icon.png').default} /> 
      <Typography  variant="h4"  sx={{ml:1}} color={props.color ?? '#326EBD'}>{props.name}</Typography> 
    </Box>
  );
};

Logo.propTypes = {
  name: PropTypes.string,
  color:PropTypes.string,
};