/***
 *  Created by Sanchit Dang
 ***/
import { LoadingScreen } from "components";
import { LayoutConfig } from "constants/index";
import { LoginContext } from "contexts";
import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  AuthCallback,
  Example,
  FourOFour,
  Home,
  Login,
  Register,
  DatasetsManager,
  ServiceManager,
  JobManager,
  DevelopersProfile,
  Profile,
  Landing,
} from "views";

import { Layout } from "./layout";

const AuthRoute = ({ children, redirectTo, parentProps, loginStatus }) => {
  return loginStatus === false ? (
    <Navigate to={redirectTo} {...parentProps} />
  ) : (
    children
  );
};

AuthRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
  parentProps: PropTypes.any.isRequired,
  loginStatus: PropTypes.bool.isRequired,
};

const UnauthRoute = ({ children, redirectTo, parentProps, loginStatus }) => {
  return !loginStatus ? (
    children
  ) : (
    <Navigate to={redirectTo} {...parentProps} />
  );
};

UnauthRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
  parentProps: PropTypes.any.isRequired,
  loginStatus: PropTypes.bool.isRequired,
};

export const AppRoutes = (props) => {
  const { loginStatus } = useContext(LoginContext);
  let landingPage =
    LayoutConfig.landingPage !== undefined
      ? LayoutConfig.landingPage !== ""
        ? LayoutConfig.landingPage
        : "/home"
      : "/home";
  if (loginStatus === undefined) return <LoadingScreen />;
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Landing />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/auth/callback/:ssoToken"
        element={(props) => (
          <AuthCallback loginStatus={loginStatus} parentProps={props} />
        )}
      />
      <Route
        exact
        path="/login"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Login {...props} />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/register"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Register {...props} />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/home"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <Home {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/examples"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <Example {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/developers"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <DevelopersProfile {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/profile"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <Profile {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/Datasets"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <DatasetsManager {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/service"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <ServiceManager {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/job"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <JobManager {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <FourOFour {...props} />
            </Layout>
          </AuthRoute>
        }
      />
    </Routes>
  );
};
