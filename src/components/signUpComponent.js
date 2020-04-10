import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import * as userActions from "../actions/userActions";

class SignUpComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fields: {
        fullname: "",
        email: "",
        password: "",
        adminkey: ''
      },
      errors: {
        fullname: "",
        email: "",
        password: ""
      },
      formIsValid: false,
      successMsg: "",
      errorMsg: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleComponent = this.toggleComponent.bind(this);
  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    // if (this.props.isLoggedIn) {
    //   this.props.history.push("/");
    // }
  }
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    this.setState({ formIsValid: true });
    //Name
    if (!fields["fullname"]) {
      this.setState({ formIsValid: true });
      errors["fullname"] = "Fullname is required";
    }
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
        this.setState({ formIsValid: true });
        errors["email"] = "Email is not valid";
      }
    } else {
      this.setState({ formIsValid: true });
      errors["email"] = "Email is Required";
    }
    if (!fields["password"]) {
      this.setState({ formIsValid: true });
      errors["password"] = "Password is required";
    } else if (fields["password"]) {
      if (fields["password"].length < 5) {
        errors["password"] = "Password is too short";
        this.setState({ formIsValid: true });
      }
    }
    this.setState({ errors: errors });
  }
  onSubmit(event) {
    event.preventDefault();
    this.handleValidation();
    if (this.state.formIsValid) {
      this.addUser();
    }
  }
  addUser() {
    const newUser = {
      fullName: this.state.fields.fullname,
      email: this.state.fields.email,
      password: this.state.fields.password,
      adminkey: this.state.fields.adminkey
    };
    this.props.actions.registerUser(newUser).then(data => {
      this.setState({ successMsg: "New user added" });
      setTimeout(() => this.setState({ successMsg: "" }), 2000);
    });
  }
  handleChange(event) {
    const fieldName = event.target.name;
    let fields = this.state.fields;
    fields[fieldName] = event.target.value;
    this.setState({ fields });
    this.handleValidation();
  }
  toggleComponent() {
    const { toggleComponent } = this.props;
    toggleComponent();
  }
  render() {
    return (
      <div className="wrapper popup-wrapper fadeInDown">
        <div className="formContent">
          <div className="pl-5 pr-5">
            <h2 className="inactive underlineHover">C&W IPL Sign Up </h2>
            <form onSubmit={this.onSubmit}>
              <div className="form-group cw-form-control">
                <TextField
                  label="Full Name"
                  name="fullname"
                  className="cw-input"
                  value={this.state.fields["fullname"]}
                  onChange={this.handleChange}
                  margin="normal"
                />
                {this.state.errors["fullname"] ? (
                  <div className="error-msg">
                    <label className="validation-message">
                      {this.state.errors["fullname"]}
                    </label>
                  </div>
                ) : null}
              </div> 
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
                  label="Password"
                  name="password"
                  type="password"
                  className="cw-input"
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
              <div className="form-group text-left cw-form-control">
                <TextField
                  label="Admin Key"
                  name="adminkey"
                  type="password"
                  className="cw-input"
                  value={this.state.fields["adminkey"]}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <span className="note"><b>Note:</b> Provide Admin key if you have to get Admin Access</span>
              </div>
              <input
                type="submit"
                value="Sign Up"
                className="btn btn-primary btn-lg btn-block cw-btn-login"
              />
            </form>
          </div>
          <div className="have-account mt-2 pb-2">
            <p>
              Already have account <span className="link" onClick={this.toggleComponent}>Login Here</span>
            </p>
          </div>
          {/* {this.state.errorMsg ? (
            <div className="alert">{this.state.errorMsg}</div>
          ) : null}
          {this.state.successMsg ? (
            <div className="success">{this.state.successMsg}</div>
          ) : null} */}
        </div>
      </div>
    );
  }
}
SignUpComponent.propTypes = {
  fields: PropTypes.object,
  fullname: PropTypes.string,
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

SignUpComponent.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpComponent);
