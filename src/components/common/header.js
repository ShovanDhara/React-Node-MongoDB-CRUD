import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PersonIcon from '@material-ui/icons/Person';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Fab from '@material-ui/core/Fab';
import PropTypes from 'prop-types';
import * as userActions from '../../actions/userActions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import LogInComponent from "../logInComponent";
import SignUpComponent from "../signUpComponent";
import FavotiteComponent from "../favoriteTeamComponent";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { getInitial } from '../../commonService/utility'
import SubjectIcon from '@material-ui/icons/Subject';

class HeaderComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            left: false,
            showAuth: false,
            showSignUp: false,
            loginMenuActive: false,
            openModal: false,
            showFavotite: false
        }
        this.onToggleSideMenu = this.onToggleSideMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.selectDropdown = this.selectDropdown.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onChooseFavorite = this.onChooseFavorite.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.toggleComponent = this.toggleComponent.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }

    componentDidMount() {
    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn) {
            this.onModalClose();
        }
    }
    onLogout() {
        this.props.actions.logoutUser();
        this.context.router.history.push('/home');
        this.toggleDropdown();
    }
    onChooseFavorite() {
        this.setState({ showFavotite: true, openModal: true, showSignUp: false, loginMenuActive: false });
    }
    onToggleSideMenu(event) {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ left: true });
    }
    closeMenu() {
        this.setState({ left: false });
    }
    selectDropdown(param) {
        if (param === 'Login') {
            this.setState({ loginMenuActive: false, openModal: true, showSignUp: false, showFavotite: false });
        } else {
            this.setState({ loginMenuActive: false, openModal: true, showSignUp: true, showFavotite: false });
        }
    }
    toggleDropdown() {
        if (!this.state.loginMenuActive) {
            document.addEventListener('click', this.handleClickOutside, false);
        } else {
            document.removeEventListener('click', this.handleClickOutside, false);
        }
        this.setState({
            loginMenuActive: !this.state.loginMenuActive
        });
    }
    onModalClose() {
        this.setState({ openModal: false });
    }
    toggleComponent() {
        this.setState({ showSignUp: !this.state.showSignUp });
    }

    handleClickOutside(event) {
        if (this.node.contains(event.target)) {
            return;
        }
        this.toggleDropdown();
    }

    render() {
        return (
            <div className={'d-flex top-header flex-row header-' + getInitial(this.props.favoriteTeam)}>
                <Drawer className="cw-side-menu" open={this.state.left} onClose={this.closeMenu}>
                    <div className="menu-container pt-4">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to='/home' onClick={this.closeMenu} >Match Summary</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/team' onClick={this.closeMenu} >Team</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to='/playerScorecard' onClick={this.closeMenu} >Player Scorecard</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to='/dashboard' onClick={this.closeMenu} >Manage Team</Link>
                            </li> */}

                            {(this.props.isLoggedIn && this.props.isAdmin) &&
                                <li className="nav-item">
                                    <Link className="nav-link" to='/manageUser' onClick={this.closeMenu} >Manage User</Link>
                                </li>
                            }

                        </ul>
                    </div>
                </Drawer>
                <div className="root-header" ref={node => { this.node = node; }}>
                    <AppBar position="static">
                        <Toolbar className="pr-0 pl-0 cw-top-toolbar">
                            <div className={'favorite-team-icon header-icon-' + getInitial(this.props.favoriteTeam)}></div>
                            <div className="setting-button">
                                <IconButton onClick={this.onToggleSideMenu} aria-label="menu">
                                    <SubjectIcon fontSize="large" />
                                </IconButton>
                            </div>
                            <Typography variant="h6" className="header-title">
                                <Link to='/home'><span className="ml-4 logo"></span></Link>
                            </Typography>
                            {this.props.isLoggedIn &&
                                <section className='d-flex'>
                                    <div className="user-info d-flex">
                                        <AccountCircleIcon fontSize="default" className="mr-1" />
                                        <p className="p-0 m-0 user-info-name text-truncate">Hi, {this.props.userName}</p>
                                    </div>
                                </section>
                            }
                            <div className="header-dropdown">
                                <div className="setting-button pull-right">
                                    <IconButton fontSize="large" title="Logout" onClick={() => this.toggleDropdown()}>
                                        <PersonIcon fontSize="large" />
                                    </IconButton>
                                </div>
                            </div>
                        </Toolbar>
                        {this.state.loginMenuActive ?
                            <div className="dropdown-menu login-menu" aria-labelledby="dropdownMenuButton">
                                {this.props.isLoggedIn && <div className="user-type d-flex">
                                    <AssignmentIndIcon fontSize="large" className="mr-1" />
                                    <span className="pl-2"> {this.props.isAdmin ? 'Admin User' : 'Guest User'}</span>
                                </div>}
                                {!this.props.isLoggedIn && <a className="dropdown-item" onClick={() => this.selectDropdown('Login')}>Login</a>}
                                {!this.props.isLoggedIn && <a className="dropdown-item" onClick={() => this.selectDropdown('Signup')}>Sign Up</a>}
                                {this.props.isLoggedIn && <a className="dropdown-item" onClick={this.onChooseFavorite}>Choose Favorite Team</a>}
                                {this.props.isLoggedIn && <a className="dropdown-item" onClick={this.onLogout}>Sign Out</a>}
                            </div> : null}
                    </AppBar>
                </div>
                <Modal
                    open={this.state.openModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    onClose={this.onModalClose}
                    BackdropProps={{
                        timeout: 500,
                    }}>
                    <Fade in={this.state.openModal}>
                        <div className="auth-wrapper">
                            {(!this.state.showSignUp && !this.state.showFavotite) && <LogInComponent toggleComponent={this.toggleComponent} />}
                            {(this.state.showSignUp && !this.state.showFavotite) &&
                                <SignUpComponent toggleComponent={this.toggleComponent} />}
                            {this.state.showFavotite &&
                                <FavotiteComponent closeModal={this.onModalClose} />}
                        </div>
                    </Fade>
                </Modal>
            </div >
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        favoriteTeam: state.user.favoriteTeam,
        isAdmin: state.user.isAdmin,
        isLoggedIn: state.user.isLoggedIn,
        userName: state.user.loginData.name
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);