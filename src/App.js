import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Routes from "./routes";
import { updateAuthentication, isLoading } from "./store/action";

const App = (props) => {
  let childProps = {
    isAuthenticated: props.isAuthenticated,
  };

  return (
    <div className={`app light`}>
      <Routes childProps={childProps} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.appState.isAuthenticated,
    isLoading: state.appState.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAuth: (bool, user) => dispatch(updateAuthentication(bool, user)),
    updateLoading: (bool) => dispatch(isLoading(bool)),
  };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
export default connect(mapStateToProps, mapDispatchToProps)(App);
