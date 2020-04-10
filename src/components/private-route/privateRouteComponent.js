import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn === true ? (
        <Component {...props} />
      ) : (
          <Redirect to="/" />
        )
    }
  />
);
PrivateRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn
});
export default connect(mapStateToProps)(PrivateRoute);