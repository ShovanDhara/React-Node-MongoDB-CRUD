import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as userActions from "../actions/userActions";
import TextField from "@material-ui/core/TextField";

class LogInComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      fields: {
        email: "",
        password: ""
      },
      errors: {
        email: "",
        password: ""
      },
      formIsValid: false,
      successMsg: "",
      errorMsg: ""
    };
  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {

  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    this.setState({ formIsValid: true });
    //Email
    if (fields["email"]) {
      let lastAtPos = fields["email"].lastIndexOf("@");
      let lastDotPos = fields["email"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email"].indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          fields["email"].length - lastDotPos > 2
        )
      ) {
        this.setState({ formIsValid: false });
        errors["email"] = "Email is not valid";
      }
    } else {
      this.setState({ formIsValid: false });
      errors["email"] = "Email is Required";
    }
    if (!fields["password"]) {
      this.setState({ formIsValid: false });
      errors["password"] = "Password is required";
    } else if (fields["password"]) {
      if (fields["password"].length < 5) {
        errors["password"] = "Password is too short";
        this.setState({ formIsValid: false });
      }
    }
    this.setState({ errors: errors });
  }
  onSubmit = (event) => {
    event.preventDefault();
    this.handleValidation();
    if (this.state.formIsValid) {
      this.login();
    }
  }
  login() {
    const user = {
      email: this.state.fields.email,
      password: this.state.fields.password
    };
    this.setState({ errorMsg: "" });
    this.setState({ successMsg: "" });
    this.props.actions.loginUser(user);
  }
  handleChange = (event) => {
    const fieldName = event.target.name;
    let fields = this.state.fields;
    fields[fieldName] = event.target.value;
    this.setState({ fields });
    this.handleValidation();
  }
  toggleComponent = () => {
    const { toggleComponent } = this.props;
    toggleComponent();
  }

  render() {
    return (
      <div className="wrapper popup-wrapper fadeInDown">
        <div className="formContent">
          <div className="pl-5 pr-5">
            <h2 className="inactive underlineHover">C&W IPL Log In</h2>
            <form onSubmit={this.onSubmit}>
              <div className="form-group cw-form-control">
                <TextField
                  label="Email"
                  name="email"
                  className="cw-input"
                  value={this.state.fields["email"]}
                  onChange={this.handleChange}
                  margin="normal"
                />
                {this.state.errors["email"] ? (
                  <div className="error-msg">
                    <label className="validation-message">
                      {this.state.errors["email"]}
                    </label>
                  </div>
                ) : null}
              </div>
              <div className="form-group cw-form-control">
                <TextField
                  className="cw-input"
                  label="Password"
                  name="password"
                  type="password"
                  value={this.state.fields["password"]}
                  onChange={this.handleChange}
                  margin="normal"
                />
                {this.state.errors["password"] ? (
                  <div className="error-msg">
                    <label className="validation-message">
                      {this.state.errors["password"]}
                    </label>
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                value="Log In"
                className="btn btn-primary btn-lg btn-block cw-btn-login"
              />
            </form>
          </div>
          <div className="have-account mt-3 pb-3">
            <p>
              Don't have any account <span className="link" onClick={this.toggleComponent}>Signup Here</span>
            </p>
          </div>
          {this.state.errorMsg ? (
            <div className="alert">{this.state.errorMsg}</div>
          ) : null}
          {this.state.successMsg ? (
            <div className="success">{this.state.successMsg}</div>
          ) : null}
        </div>
      </div>
    );
  }
}
LogInComponent.propTypes = {
  fields: PropTypes.object,
  email: PropTypes.string,
  password: PropTypes.string,
  onSubmit: PropTypes.func,
  handleChange: PropTypes.func
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn
  };
};

LogInComponent.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInComponent);
