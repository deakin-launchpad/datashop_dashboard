/***
 *  Created by Sanchit Dang
 ***/
import { useEffect } from 'react';
import './helpers/database/idb';
import { AppRoutes } from './bricks/index';
import { ContextManager } from 'contexts';
import { Notification, LoginCheck, GlobalStyles } from 'components';
import { ThemeProvider } from 'theme';
import { useSocket } from "helpers/index";
import { notify } from 'components/index';

const App = (props) => { 
  useEffect(() => {
    document.title = process.env.REACT_APP_NAME;
  }, []);

  useSocket("on", "notification", (response) => {
    console.log("notification",response);
    if(response.success) return  notify(response.message,null,'success');
    return  notify(response.message,null,'warning');
  });

  useSocket("on", "message", (response) => {
    console.log("message",response);
    // if(response.success) return  notify(response.message,null,'success');
    // return  notify(response.message,null,'warning');
  });

  return (
    <ContextManager>
      <ThemeProvider>
        <LoginCheck>
          <AppRoutes {...props} />
          <GlobalStyles />
          <Notification  />
        </LoginCheck>
      </ThemeProvider>
    </ContextManager>
  );
};

export default App;
