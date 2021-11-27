import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ForgotPassword from "./containers/ForgotPassword";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Home from "./containers/Home";

const Routes = ({ childProps }) => {
  return (
    <Switch>
      <Route exact path="/index.html" render={() => <Redirect to="/" />} />
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/forgotpassword" component={ForgotPassword} />
    </Switch>
  );
};

export default Routes;
