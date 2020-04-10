import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as matchActions from '../actions/matchActions';
import SelectInput from "./common/selectBoxComponent";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';

class AddEditMatchComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedMatchID: this.props.match.params.id ? this.props.match.params.id : '',
            isEdit: this.props.match.params.id ? true : false,
            fields: {
                id: null,
                season: '',
                city: '',
                date: null,
                team1: '',
                team2: '',
                toss_winner: '',
                toss_decision: '',
                result: '',
                dl_applied: 0,
                winner: '',
                win_by_runs: 0,
                win_by_wickets: 0,
                player_of_match: '',
                venue: '',
                umpire1: '',
                umpire2: '',
                umpire3: ''
            },
            errors: {}
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        if (this.state.isEdit && this.state.selectedMatchID) {
            this.getMatchDetail(Number(this.state.selectedMatchID));
        }
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["season"]) {
            formIsValid = false;
            errors["season"] = "Cannot be empty";
        }
        if (!fields["city"]) {
            formIsValid = false;
            errors["city"] = "Cannot be empty";
        }
        if (!fields["date"]) {
            formIsValid = false;
            errors["date"] = "Cannot be empty";
        }
        if (!fields["team1"]) {
            formIsValid = false;
            errors["team1"] = "Cannot be empty";
        }
        if (!fields["team2"]) {
            formIsValid = false;
            errors["team2"] = "Cannot be empty";
        }
        if (!fields["toss_winner"]) {
            formIsValid = false;
            errors["toss_winner"] = "Cannot be empty";
        }
        if (!fields["toss_decision"]) {
            formIsValid = false;
            errors["toss_decision"] = "Cannot be empty";
        }
        if (!fields["winner"]) {
            formIsValid = false;
            errors["winner"] = "Cannot be empty";
        }
        if (!fields["venue"]) {
            formIsValid = false;
            errors["venue"] = "Cannot be empty";
        }
        if (!fields["win_by_runs"]) {
            formIsValid = false;
            errors["win_by_runs"] = "Cannot be empty";
        }
        if (!fields["umpire1"]) {
            formIsValid = false;
            errors["umpire1"] = "Cannot be empty";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(event) {
        const fieldName = event.target.name;
        let fields = this.state.fields;
        fields[fieldName] = event.target.value;
        this.setState({ fields });
        this.handleValidation();
    }

    handleDateChange(value) {
        let fields = this.state.fields;
        fields['date'] = value;
        this.setState({ fields });
        this.handleValidation();
    }

    getMatchDetail(id) {
        let fields = {};
        this.props.actions.getMatchData(id).then((data) => {
            if (data) {
                fields["season"] = data.season;
                fields["city"] = data.city;
                fields["date"] = data.date;
                fields["team1"] = data.team1;
                fields["team2"] = data.team2;
                fields["toss_winner"] = data.toss_winner;
                fields["toss_decision"] = data.toss_decision;
                fields["result"] = data.result;
                fields["winner"] = data.winner;
                fields["win_by_runs"] = data.win_by_runs;
                fields["win_by_wickets"] = data.win_by_wickets;
                fields["player_of_match"] = data.player_of_match;
                fields["venue"] = data.venue;
                fields["umpire1"] = data.umpire1;
                fields["umpire2"] = data.umpire2;
                fields["umpire3"] = data.umpire3;
                this.setState({ fields: fields });
            }
        })
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()) {
            if (!this.state.isEdit) {
                this.addMatch();
            } else {
                this.updateProduct();
            }
        }
    }

    addMatch() {
        const newmatch = this.state.fields;
        this.props.actions.addMatch(newmatch);
    }

    updateProduct() {
        const updatedMatch = {
            season: this.state.fields.season,
            city: this.state.fields.city,
            date: this.state.fields.date,
            team1: this.state.fields.team1,
            team2: this.state.fields.team2,
            toss_winner: this.state.fields.toss_winner,
            toss_decision: this.state.fields.toss_decision,
            result: this.state.fields.result,
            dl_applied: parseInt(this.state.fields.dl_applied ? this.state.fields.dl_applied : 0),
            winner: this.state.fields.winner,
            win_by_runs: parseInt(this.state.fields.win_by_runs),
            win_by_wickets: parseInt(this.state.fields.win_by_wickets),
            player_of_match: this.state.fields.player_of_match,
            venue: this.state.fields.venue,
            umpire1: this.state.fields.umpire1,
            umpire2: this.state.fields.umpire2,
            umpire3: this.state.fields.umpire3,
        };
        this.props.actions.updateMatch(updatedMatch, this.state.selectedMatchID);
    }
    render() {
        return (
            <section className="container mb-5 cw-form-wrapper">
                <div className="form-heading">
                    <h5 className="form-heading-tag">{this.state.isEdit ? 'Edit Match' : 'Add new match'}</h5>
                </div>
                <div className="form-wrapper tran-container">
                    <form className="add-edit-form" onSubmit={this.onSubmit} ref={form => (this.formEl = form)}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="season-select"
                                                name="season"
                                                value={this.state.fields.season}
                                                options={this.props.seasons}
                                                onChange={this.handleChange}
                                                placeholder="Seasons"
                                            />
                                            {this.state.errors["season"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["season"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="city"
                                                name="city"
                                                value={this.state.fields.city}
                                                options={this.props.cities}
                                                onChange={this.handleChange}
                                                placeholder="City"
                                            />
                                            {this.state.errors["city"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["city"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    id="date-picker-date"
                                                    label="Choose Date"
                                                    format="MM/dd/yyyy"
                                                    className="cw-input"
                                                    value={this.state.fields.date}
                                                    onChange={this.handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                            {this.state.errors["date"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["date"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="team1-select"
                                                name="team1"
                                                value={this.state.fields.team1}
                                                options={this.props.teams}
                                                onChange={this.handleChange}
                                                placeholder="Team 1"
                                            />
                                            {this.state.errors["team1"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["team1"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="team2-select"
                                                name="team2"
                                                value={this.state.fields.team2}
                                                options={this.props.teams}
                                                onChange={this.handleChange}
                                                placeholder="Team 2"
                                            />
                                            {this.state.errors["team2"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["team2"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="toss_winner-select"
                                                name="toss_winner"
                                                value={this.state.fields.toss_winner}
                                                options={this.props.teams}
                                                onChange={this.handleChange}
                                                placeholder="Toss Winner"
                                            />
                                            {this.state.errors["toss_winner"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["toss_winner"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="toss_decision-select"
                                                name="toss_decision"
                                                value={this.state.fields.toss_decision}
                                                options={this.props.tossDecision}
                                                onChange={this.handleChange}
                                                placeholder="Toss Decision"
                                            />
                                            {this.state.errors["toss_decision"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["toss_decision"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <TextField
                                                label="Result"
                                                name="result"
                                                className="cw-input"
                                                value={this.state.fields.result}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            {this.state.errors["result"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["result"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="winner-select"
                                                name="winner"
                                                value={this.state.fields.winner}
                                                options={this.props.teams}
                                                onChange={this.handleChange}
                                                placeholder="Winner"
                                            />
                                            {this.state.errors["winner"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["winner"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <TextField
                                                label="Win by Runs"
                                                name="win_by_runs"
                                                className="cw-input"
                                                type="number"
                                                value={this.state.fields.win_by_runs}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            {this.state.errors["win_by_runs"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["win_by_runs"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <TextField
                                                label="Win by Wickets"
                                                name="win_by_wickets"
                                                type="number"
                                                className="cw-input"
                                                value={this.state.fields.win_by_wickets}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            {this.state.errors["win_by_wickets"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["win_by_wickets"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <TextField
                                                label="Player of the match"
                                                name="player_of_match"
                                                className="cw-input"
                                                value={this.state.fields.player_of_match}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            {this.state.errors["player_of_match"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["player_of_match"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="venue-select"
                                                name="venue"
                                                value={this.state.fields.venue}
                                                options={this.props.venues}
                                                onChange={this.handleChange}
                                                placeholder="Venue"
                                            />
                                            {this.state.errors["venue"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["venue"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="umpire1-select"
                                                name="umpire1"
                                                value={this.state.fields.umpire1}
                                                options={this.props.umpires}
                                                onChange={this.handleChange}
                                                placeholder="Umpire 1"
                                            />
                                            {this.state.errors["umpire1"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["umpire1"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="umpire2-select"
                                                name="umpire2"
                                                value={this.state.fields.umpire2}
                                                options={this.props.umpires}
                                                onChange={this.handleChange}
                                                placeholder="Umpire 2"
                                            />
                                            {this.state.errors["umpire2"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["umpire2"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="form-group cw-form-control">
                                            <SelectInput
                                                id="umpire3-select"
                                                name="umpire3"
                                                value={this.state.fields.umpire3}
                                                options={this.props.umpires}
                                                onChange={this.handleChange}
                                                placeholder="Umpire 3"
                                            />
                                            {this.state.errors["umpire3"] ? (
                                                <div className="error-msg">
                                                    <label className="validation-message">
                                                        {this.state.errors["umpire3"]}
                                                    </label>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className='pull-right'>
                                    <Button type="submit" variant="outlined" color="primary" className="mt-2 mr-2 cw-btn-form">Submit</Button>
                                    <Link to={'/home'} className="cw-link-button"><Button type="button" variant="outlined" className="mt-2 mr-2 cw-btn-form">Back</Button></Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

AddEditMatchComponent.propTypes = {
    fields: PropTypes.shape({
        id: PropTypes.number,
        season: PropTypes.number,
        city: PropTypes.string,
        date: PropTypes.instanceOf(Date),
        team1: PropTypes.string,
        team2: PropTypes.string,
        toss_winner: PropTypes.string,
        toss_decision: PropTypes.string,
        result: PropTypes.string,
        dl_applied: PropTypes.number,
        winner: PropTypes.string,
        win_by_runs: PropTypes.number,
        win_by_wickets: PropTypes.number,
        player_of_match: PropTypes.string,
        venue: PropTypes.string,
        umpire1: PropTypes.string,
        umpire2: PropTypes.string,
        umpire3: PropTypes.string,
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

AddEditMatchComponent.propTypes = {
    actions: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(AddEditMatchComponent);