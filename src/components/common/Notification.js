/***
 *  Created by Sanchit Dang
 * */

import { useEffect, useState } from "react";
import { Snackbar,Alert } from "@mui/material";
import PropTypes from "prop-types";

let OpenNotificationFunction;

/***
 *  Notification is a component which needs to be places in Global App.js or alongside the Routes
 *  DisplayBrowserNotification triggers browser notification
 *  notify() is a helper function to trigger Notification Component
 *  @notify params are message, callback, variant
 ***/

const EnhancedNotification = (props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [verticalPosition, setVerticalPosition] = useState("bottom");
  const [horizontalPosition, setHorizonPosition] = useState("right");
  const [variant,setVariant] = useState("");

  const openNotification = (newMessage,variant) => {
    if(variant) setVariant(variant); 
    setOpen(true);
    setMessage(newMessage);
  };
  const closeNotification = () => {
    setOpen(false);
    setMessage("");
    setVariant("");
  };
  useEffect(() => {
    OpenNotificationFunction = openNotification;
  }, []);
  useEffect(() => {
    if (props.horizontal !== undefined) {
      setHorizonPosition(props.horizontal);
    }
    if (props.vertical !== undefined) {
      setVerticalPosition(props.vertical);
    }
  }, [props]);
  const messageSpan = (
    <span
      id="snackbar-message-id"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
  const content = (
    <Snackbar
      anchorOrigin={{
        vertical: verticalPosition,
        horizontal: horizontalPosition,
      }}
      message={messageSpan}
      autoHideDuration={3000}
      onClose={closeNotification}
      open={open}
      ContentProps={{
        "aria-describedby": "snackbar-message-id",
      }}
    >
      {variant ?  <Alert onClose={closeNotification} severity={variant} sx={{ width: '100%' }}>
        {message}
      </Alert> : null} 
    </Snackbar>
  );
  if (message === undefined) return null;
  if (message === "") return null;
  return content;
};

export const DisplayBrowserNotification = (message) => {
  if (!("Notification" in window)) {
    alert(message);
  } else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
};

export const notify = (message, callback, variant) => {
  if (variant === "browser") DisplayBrowserNotification(message);
  else if (variant === "both") {
    OpenNotificationFunction(message);
    DisplayBrowserNotification(message);
  }
  else if(variant === "success" || variant ==="warning"){
    OpenNotificationFunction(message,variant);
  }
  else OpenNotificationFunction(message);
  if (typeof callback === "function") callback();
};

EnhancedNotification.propTypes = {
  horizontal: PropTypes.string,
  vertical: PropTypes.string,
  severity:PropTypes.string,
};

export default EnhancedNotification;
