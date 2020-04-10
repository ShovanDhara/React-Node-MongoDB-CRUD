import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import CarouselComponent from './common/carousel'
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import { getInitial } from '../commonService/utility'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActionComponent from './common/paginationActionComponent';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class ManageUserComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            rowsPerPage: 10,
            page: 0,
            setPage: 0,
        }
        this.getAllUser = this.getAllUser.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleAdminStatusChange = this.handleAdminStatusChange.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        this.getAllUser();
    }
    handleChangePage(event, newPage) {
        this.setState({ setPage: newPage });
    }
    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
        this.setState({ setPage: 0 });
    }
    getAllUser() {
        this.props.actions.loadUser().then((data) => {
            if (data) {
                this.setState({ users: data })
            }
        })
    }
    handleAdminStatusChange(event, row) {
        console.log(event.target.checked);
        const userData = {
            email: row.email,
            isAdmin: event.target.checked ? true : false
        }
        this.props.actions.updateUserPermission(userData).then((data) => {
            if (data) {
                this.setState({ users: data })
            }
        })
    }

    deleteUser(userid) {
        this.props.actions.deleteUser(userid).then((data) => {
            if (data) {
                this.setState({ users: data })
            }
        })
    }

    render() {
        return (
            <section>
                <CarouselComponent />
                <div className="inner-page-wrapper">
                    <div className="inner-page-header">
                        <div className="inner-page-header-wrapper">
                            <h5 className="page-heading">Manage User </h5>
                        </div>
                    </div>
                    <div className="inner-page-content">
                        <div className="white-bg p-3 d-flex">
                            {this.state.users.length > 0 &&
                                <div className="container user-wrapper">
                                    <h4 className="tab-content-heading">Upate user data.
                                         <span>(Manage permission or delete perticular user)</span> </h4>
                                    <section className="row w-100">
                                        <div className="col-lg-12">
                                            {/* <div className="clearfix tran-container home-form-container">
                                        {this.state.team_1} <span className="pr-2 pl-2">vs</span> {this.state.team_2}
                                    </div> */}
                                            <Paper className="table-wapper w-100">
                                                <Table className="cw-table w-100 cw-table-batting">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Full Name</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell align="left">FavoriteTeam</TableCell>
                                                            <TableCell align="left">Is Admin</TableCell>
                                                            <TableCell align="left"></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.users.slice(this.state.setPage * this.state.rowsPerPage, this.state.setPage * this.state.rowsPerPage + this.state.rowsPerPage)
                                                            .map(row => (
                                                                <TableRow key={row._id} hidden={row.email === this.props.currentUser.email}>
                                                                    <TableCell align="left">{row.fullName}</TableCell>
                                                                    <TableCell align="left">{row.email}</TableCell>
                                                                    <TableCell align="left">{row.favoriteTeam}</TableCell>
                                                                    <TableCell align="left">
                                                                        <Switch
                                                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                            checked={row.isAdmin}
                                                                            onChange={() => this.handleAdminStatusChange(event, row)}
                                                                            value={row.isAdmin}
                                                                            color="primary"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <IconButton size="small" className="ml-1" aria-label="delete" title="Delete user" onClick={() => this.deleteUser(row._id)}>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                                <Table className="cw-pagination">
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TablePagination
                                                                rowsPerPageOptions={[10, 20, 50]}
                                                                colSpan={16}
                                                                count={this.state.users.length}
                                                                rowsPerPage={this.state.rowsPerPage}
                                                                page={this.state.setPage}
                                                                SelectProps={{
                                                                    inputProps: { 'aria-label': 'rows per page' },
                                                                    native: true,
                                                                }}
                                                                onChangePage={this.handleChangePage}
                                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                                ActionsComponent={TablePaginationActionComponent}
                                                            />
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </Paper>
                                        </div>
                                    </section>
                                </div>
                            }
                            {!this.state.users.length &&
                                <div className="alert alert-warning text-center mt-4" role="alert">
                                    No data available
                    </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

ManageUserComponent.propTypes = {
    users: PropTypes.array
};
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.user.loginData
    };
};

ManageUserComponent.propTypes = {
    actions: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserComponent);