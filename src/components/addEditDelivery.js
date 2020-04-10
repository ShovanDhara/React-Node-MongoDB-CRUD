import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as matchActions from '../actions/deliveryActions';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import SelectInput from "./common/selectBoxComponent";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import { Checkbox } from '@material-ui/core';
import TablePaginationActionComponent from "./common/paginationActionComponent";

class AddEditDeliveryComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            rows: [],
            rowsPerPage: 20,
            page: 0,
            setPage: 0,
            count: 0,
            fieldId: 0,
            selectedMatchID: this.props.match.params.id ? this.props.match.params.id : '',
            isEdit: this.props.match.params.id ? true : false,
            fields: {

                _id: '',
                inning: 0,
                batting_team: '',//drop
                bowling_team: '',//drop
                over: 0,
                ball: 0,
                batsman: '',//drop
                non_striker: '',//drop
                bowler: '',//drop
                is_super_over: false,
                wide_runs: 0,
                bye_runs: 0,
                legbye_runs: 0,
                noball_runs: 0,
                penalty_runs: 0,
                batsman_runs: 0,
                extra_runs: 0,
                total_runs: 0,
                player_dismissed: '',
                dismissal_kind: '',
                fielder: ''

            },
            errors: {}
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getDeliveryDetail = this.getDeliveryDetail.bind(this);

    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        if (this.state.isEdit && this.state.selectedMatchID) {
            this.getDeliveryDetail(Number(this.state.selectedMatchID));
        }
    }
    handleChangePage(event, newPage) {
        this.setState({ setPage: newPage });
    }
    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: parseInt(event.target.value) });
        this.setState({ setPage: 0 });
    }
    handleValidation() {
        let fields = this.state.rows;
        let errors = {};
        let formIsValid = true;

        if (!fields[this.state.fieldId]["inning"]) {
            formIsValid = false;
            errors["inning"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["batting_team"]) {
            formIsValid = false;
            errors["batting_team"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["bowling_team"]) {
            formIsValid = false;
            errors["bowling_team"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["over"]) {
            formIsValid = false;
            errors["over"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["ball"]) {
            formIsValid = false;
            errors["ball"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["batsman"]) {
            formIsValid = false;
            errors["batsman"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["non_striker"]) {
            formIsValid = false;
            errors["non_striker"] = "Cannot be empty";
        }
        if (!fields[this.state.fieldId]["bowler"]) {
            formIsValid = false;
            errors["bowler"] = "Cannot be empty";
        }

        this.setState({ errors: errors });
        //formIsValid = true;
        return formIsValid;
    }

    handleChange(event) {
        const fieldName = event.target.name;
        let fieldID = event.target.id.split('_')[0]
        // this.setState({ fieldId: event.target.id.split('_')[0] });
        let fields = [...this.state.rows];
        if (fieldName === 'is_super_over') {
            fields[fieldID][fieldName] = event.target.checked;
        } else {
            fields[fieldID][fieldName] = event.target.value
        }
        this.setState({ rows: fields });
        this.setState({ fieldId: fieldID });
        this.setState({fields});
        this.handleValidation();
    }

    getDeliveryDetail(match_id) {
        let fieldsDelivery = [];
        this.props.actions.getDeliveryData(match_id).then((data) => {
            if (data) {
                data.map(delivery => {
                    let fields = {};
                    fields["_id"] = delivery._id;
                    fields["inning"] = delivery.inning;
                    fields["batting_team"] = delivery.batting_team;
                    fields["bowling_team"] = delivery.bowling_team;
                    fields["over"] = delivery.over;
                    fields["ball"] = delivery.ball;
                    fields["batsman"] = delivery.batsman;
                    fields["non_striker"] = delivery.non_striker;
                    fields["bowler"] = delivery.bowler;
                    fields["is_super_over"] = delivery.is_super_over === 0 ? false : true;
                    fields["wide_runs"] = delivery.wide_runs;
                    fields["bye_runs"] = delivery.bye_runs;
                    fields["legbye_runs"] = delivery.legbye_runs;
                    fields["noball_runs"] = delivery.noball_runs;
                    fields["penalty_runs"] = delivery.penalty_runs;
                    fields["batsman_runs"] = delivery.batsman_runs;
                    fields["extra_runs"] = delivery.extra_runs;
                    fields["total_runs"] = delivery.total_runs;
                    fields["player_dismissed"] = delivery.player_dismissed;
                    fields["dismissal_kind"] = delivery.dismissal_kind;
                    fields["fielder"] = delivery.fielder;
                    //this.setState({ fields: fields });
                    //this.setState({ rows: delivery });
                    fieldsDelivery.push(fields);
                });
                this.setState({ rows: fieldsDelivery });
            }

        })
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()) {
            //if (!this.state.isEdit) {
            // this.addDelivery();
            //} else {
            //let id=event.target.id.split('_')[0];
            this.updateDelivery();
            //}
        }
    }


    addDelivery() {
        const newDelivery = this.state.fields;
        this.props.actions.addDelivery(newDelivery);
    }

    updateDelivery() {
        const updatedDelivery = {
            inning: this.state.fields[this.state.fieldId].inning,
            batting_team: this.state.fields[this.state.fieldId].batting_team,
            bowling_team: this.state.fields[this.state.fieldId].bowling_team,
            over: parseInt(this.state.fields[this.state.fieldId].over),
            ball: parseInt(this.state.fields[this.state.fieldId].ball),
            batsman: this.state.fields[this.state.fieldId].batsman,
            non_striker: this.state.fields[this.state.fieldId].non_striker,
            bowler: this.state.fields[this.state.fieldId].bowler,
            is_super_over: parseInt(this.state.fields[this.state.fieldId].is_super_over === true ? 1 : 0),
            wide_runs: parseInt(this.state.fields[this.state.fieldId].wide_runs),
            bye_runs: parseInt(this.state.fields[this.state.fieldId].bye_runs),
            legbye_runs: parseInt(this.state.fields[this.state.fieldId].legbye_runs),
            noball_runs: parseInt(this.state.fields[this.state.fieldId].noball_runs),
            penalty_runs: parseInt(this.state.fields[this.state.fieldId].penalty_runs),
            batsman_runs: parseInt(this.state.fields[this.state.fieldId].batsman_runs),
            extra_runs: parseInt(this.state.fields[this.state.fieldId].extra_runs),
            total_runs: parseInt(this.state.fields[this.state.fieldId].total_runs),
            player_dismissed: this.state.fields[this.state.fieldId].player_dismissed,
            dismissal_kind: this.state.fields[this.state.fieldId].dismissal_kind,
            fielder: this.state.fields[this.state.fieldId].fielder
        };
        this.props.actions.updateDelivery(updatedDelivery, this.state.fields[this.state.fieldId]._id);
    }
    render() {
        let is_super_over;

        return (
            <section className="container mb-5 cw-form-wrapper">
                <div className="form-heading">
                    <h5 className="form-heading-tag">{this.state.isEdit ? 'Edit Delivery' : 'Add new delivery'}</h5>
                </div>
                <div>
                    <Table className="cw-pagination">
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[20, 50, 100]}
                                    colSpan={8}
                                    count={this.state.rows.length}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.setPage}
                                    SelectProps={{
                                        inputProps: { "aria-label": "rows per page" },
                                        native: true
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActionComponent}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                <div className="form-wrapper tran-container">
                    <form className="add-edit-form" onSubmit={this.onSubmit} ref={form => (this.formEl = form)}>
                        {this.state.rows.length > 0 && (
                            <div className="match-section container">
                                {this.state.rows.slice(
                                    this.state.setPage * this.state.rowsPerPage,
                                    this.state.setPage * this.state.rowsPerPage +
                                    this.state.rowsPerPage
                                ).map((row, index) => (
                                    <section className="mb-4" key={row._id.toString()}>
                                        <div className="row m-0">
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_Inning"}
                                                        label="Innings"
                                                        name="inning"
                                                        value={row.inning}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                        className="cw-input"
                                                    />
                                                    {this.state.errors["inning"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["inning"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_batting_team"}
                                                        label="Batting Team"
                                                        name="batting_team"
                                                        value={row.batting_team}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                        className="cw-input"
                                                    />
                                                    {this.state.errors["batting_team"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["batting_team"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_over"}
                                                        label="Over"
                                                        name="over"
                                                        value={row.over}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                    {this.state.errors["over"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["over"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_ball"}
                                                        label="Ball"
                                                        className="cw-input"
                                                        name="ball"
                                                        value={row.ball}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                    {this.state.errors["ball"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["ball"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_batsman"}
                                                        label="Batsman"
                                                        name="batsman"
                                                        className="cw-input"
                                                        value={row.batsman}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                    {this.state.errors["batsman"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["batsman"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_non_striker"}
                                                        label="Non Striker"
                                                        name="non_striker"
                                                        className="cw-input"
                                                        value={row.non_striker}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                    {this.state.errors["non_striker"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["non_striker"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_bowler"}
                                                        label="Bowler"
                                                        name="bowler"
                                                        value={row.bowler}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                        className="cw-input"
                                                    />
                                                    {this.state.errors["bowler"] ? (
                                                        <div className="error-msg">
                                                            <label className="validation-message">
                                                                {this.state.errors["bowler"]}
                                                            </label>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <label name="Is Super Over" className="checkbox-label">Is Super Over</label>
                                                    <Checkbox id={index + "_id_is_super_over"}
                                                        name="is_super_over"
                                                        checked={row.is_super_over}
                                                        value={row.is_super_over}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                        className="cw-checkbox"
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_wide_runs"}
                                                        label="Wide Runs"
                                                        name="wide_runs"
                                                        value={row.wide_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                        className="cw-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_bye_runs"}
                                                        label="Bye Runs"
                                                        name="bye_runs"
                                                        value={row.bye_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                        className="cw-input"
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_legbye_runs"}
                                                        label="Legbye Runs"
                                                        name="legbye_runs"
                                                        className="cw-input"
                                                        value={row.legbye_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        id={index + "_id_noball_runs"}
                                                        label="Noball Runs"
                                                        name="noball_runs"
                                                        className="cw-input"
                                                        value={row.noball_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_penalty_runs"}
                                                        label="Penalty Runs"
                                                        name="penalty_runs"
                                                        value={row.penalty_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_batsman_runs"}
                                                        label="Batsman Runs"
                                                        name="batsman_runs"
                                                        value={row.batsman_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_extra_runs"}
                                                        label="Extra Runs"
                                                        name="extra_runs"
                                                        value={row.extra_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_total_runs"}
                                                        label="Total Runs"
                                                        name="total_runs"
                                                        value={row.total_runs}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_player_dismissed"}
                                                        label="Player Dismissed"
                                                        name="player_dismissed"
                                                        value={row.player_dismissed}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_dismissal_kind"}
                                                        label="Dismissal Kind"
                                                        name="dismissal_kind"
                                                        value={row.dismissal_kind}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="form-group cw-form-control">
                                                    <TextField
                                                        className="cw-input"
                                                        id={index + "_id_fielder"}
                                                        label="Fielder"
                                                        name="fielder"
                                                        value={row.fielder}
                                                        onChange={this.handleChange}
                                                        margin="normal"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row m-0">
                                            <div className="col-lg-12 clearfix">
                                                <div className='pull-right'>
                                                    <Button type="submit" variant="outlined" className="mt-2 mr-2 cw-btn-form">Update</Button>
                                                    <Link to={'/home'} className="cw-link-button">
                                                        <Button type="button" variant="outlined"
                                                            className="mt-2 mr-2 cw-btn-form">Back</Button></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </section>))}
                            </div>)}
                    </form>
                </div>
            </section>
        );
    }
}

AddEditDeliveryComponent.propTypes = {
    fields: PropTypes.shape({
        match_id: PropTypes.number,
        inning: PropTypes.number,
        batting_team: PropTypes.string,
        bowling_team: PropTypes.string,
        over: PropTypes.number,
        ball: PropTypes.number,
        batsman: PropTypes.string,
        non_striker: PropTypes.string,
        bowler: PropTypes.string,
        is_super_over: PropTypes.number,
        wide_runs: PropTypes.number,
        bye_runs: PropTypes.number,
        legbye_runs: PropTypes.number,
        noball_runs: PropTypes.number,
        penalty_runs: PropTypes.number,
        batsman_runs: PropTypes.number,
        extra_runs: PropTypes.number,
        total_runs: PropTypes.number,
        player_dismissed: PropTypes.string,
        dismissal_kind: PropTypes.string,
        fielder: PropTypes.string
    }),
    onSubmit: PropTypes.func,
    handleChange: PropTypes.func
};
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(matchActions, dispatch)
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        seasons: state.matches.seasons,
        teams: state.matches.teams,
        tossDecision: state.matches.tossDecision,
        umpires: state.matches.umpires,
        cities: state.matches.cities,
        venues: state.matches.venues
    };
};

AddEditDeliveryComponent.propTypes = {
    actions: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(AddEditDeliveryComponent);