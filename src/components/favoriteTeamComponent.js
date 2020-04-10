import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as userActions from "../actions/userActions";
import SelectInput from "./common/selectBoxComponent";
import TextField from "@material-ui/core/TextField";

class FavotiteComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      teamField: '',
      teamFieldError: '',
      formIsValid: true
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {
    if (this.props.favoriteTeam) {
      this.setState({ teamField: this.props.favoriteTeam });
    }
  }

  handleValidation() {
    this.setState({ formIsValid: true });
    if (!this.state.teamField) {
      this.setState({ teamFieldError: "Team name is required" });
    }
  }
  onSubmit(event) {
    event.preventDefault();
    this.handleValidation();
    if (this.state.formIsValid) {
      this.setFavorite();
    }
  }
  setFavorite() {
    const userObj = {
      'email': this.props.userData.email,
      'favoriteTeam': this.state.teamField
    }
    this.setState({ teamFieldError: "" });
    this.props.actions.setFavorite(userObj).then((data) => {
      if (data) {
        const { closeModal } = this.props;
        closeModal();
      }
    });
  }

  handleChange(event) {
    this.setState({ teamField: event.target.value });
  }

  render() {
    return (
      <div className="wrapper popup-wrapper fadeInDown">
        <div className="formContent">
          <div className="pl-5 pr-5 pb-5">
            <h2 className="inactive underlineHover">Choose Favorite Team</h2>
            <form onSubmit={this.onSubmit}>
              <div className="form-group cw-form-control mt-4">
                <SelectInput
                  id="teamselect"
                  name="team"
                  value={this.state.teamField}
                  options={this.props.teams}
                  onChange={this.handleChange}
                  placeholder="Choose team name"
                />
                {this.state.teamFieldError ? (
                  <div className="error-msg">
                    <label className="validation-message">
                      {this.state.teamFieldError}
                    </label>
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                value="Save"
                className="btn btn-primary btn-lg btn-block cw-btn-login"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    favoriteTeam: state.user.favoriteTeam,
    userData: state.user.loginData,
    isLoggedIn: state.user.isLoggedIn,
    teams: state.matches.teams
  };
};

FavotiteComponent.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FavotiteComponent);
