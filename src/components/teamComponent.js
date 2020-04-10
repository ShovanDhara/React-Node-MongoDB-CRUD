import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as matchActions from '../actions/matchActions';
import CarouselComponent from './common/carousel'
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import { getInitial } from '../commonService/utility'
import SelectInput from "./common/selectBoxComponent";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

class TeamComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedSeason: "",
            selectedTeamsBySeason: [],
            selectedMatchArray: [],
            teamData: [],
            openModal: false,
            batsmansRow: [],
            bowlersRow: [],
            selectedTeamName: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.populateParam = this.populateParam.bind(this);
        this.onSeasonSelectionChange = this.onSeasonSelectionChange.bind(this);
        this.getTeamData = this.getTeamData.bind(this);
        this.getTeamDetails = this.getTeamDetails.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.prepareTeamData = this.prepareTeamData.bind(this);
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        this.populateParam();
        this.getTeamData();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.allMatches !== prevProps.allMatches) {
            this.populateParam();
            this.getTeamData();
        }
        if (this.props.batsmans !== prevProps.batsmans || this.props.bowlers !== prevProps.bowlers) {
            this.prepareTeamData();
        }
    }

    populateParam() {
        let selectedLoadTeam;
        let selectedLoadSeason;
        if (this.props.seasons &&
            this.props.seasons.length > 0) {
            selectedLoadSeason = this.props.seasons[this.props.seasons.length - 1].value;
            this.setState({ selectedSeason: selectedLoadSeason });
        }
    }
    onSeasonSelectionChange(event) {
        this.setState({ selectedSeason: event.target.value });
    }
    onModalClose() {
        this.setState({ openModal: false });
    }
    onSubmit(event) {
        event.preventDefault();
        this.getTeamData();
    }

    getTeamData() {
        let teams = [];
        let matchIds = [];
        let selectedTeamsBySeason = [];
        const selectedSeason = this.state.selectedSeason === '' ? this.props.seasons[this.props.seasons.length - 1].value : this.state.selectedSeason;
        if (this.props.teams) {
            for (let team in this.props.teams) {
                let filterMatchBySeason = this.props.allMatches.filter(data => { return data.season === selectedSeason });
                filterMatchBySeason.map((match) => {
                    if ((match.team1 === this.props.teams[team].text && selectedTeamsBySeason.indexOf(match.team1) < 0) ||
                        (match.team2 === this.props.teams[team].text && selectedTeamsBySeason.indexOf(match.team2) < 0)) {
                        selectedTeamsBySeason.push(this.props.teams[team].text);
                        teams.push({
                            'teamno': team,
                            'team': this.props.teams[team].text
                        })
                    }
                    matchIds.push(match.id);
                })
            }
            this.setState({ selectedMatchArray: matchIds });
            this.setState({ selectedTeamsBySeason: selectedTeamsBySeason });
            this.setState({ teamData: teams });
        }
    }

    getTeamDetails(teamname) {
        const payload = {
            teamName: teamname,
            matchIds: this.state.selectedMatchArray
        }
        this.setState({ selectedTeamName: teamname });
        this.props.actions.loadAllTeamMember(payload);
    }

    prepareTeamData() {
        const batsmans = this.props.batsmans
        const bowlers = this.props.bowlers
        console.log(batsmans, bowlers);
        this.setState({ batsmansRow: batsmans.batsmen })
        this.setState({ bowlersRow: bowlers.bowlers })
        this.setState({ openModal: true })

    }
    render() {
        return (
            <section>
                <CarouselComponent />
                <div className="inner-page-wrapper">
                    <div className="inner-page-header">
                        <div className="inner-page-header-wrapper">
                            <h5 className="page-heading">Teams</h5>
                            <div className="clear">
                                <form className="add-edit-form" onSubmit={this.onSubmit} ref={form => (this.formEl = form)}>
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <div className="form-group cw-form-control">
                                                <SelectInput
                                                    id="season-select"
                                                    name="season"
                                                    value={this.state.selectedSeason}
                                                    options={this.props.seasons}
                                                    onChange={this.onSeasonSelectionChange}
                                                    placeholder="Seasons"
                                                />

                                            </div>
                                        </div>
                                        <div className='pull-right'>
                                            <Button type="submit" variant="outlined" color="primary" className="mr-2 cw-btn-form">Submit</Button>
                                            <Link to={'/home'} className="cw-link-button"><Button type="button" variant="outlined" className="mr-2 cw-btn-form">Back</Button></Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="inner-page-content">
                        <div className="ipl-team-wrapper white-bg p-3 d-flex">
                            {this.state.teamData.map(team => (
                                <div onClick={() => this.getTeamDetails(team.team)} className={'team-items d-flex background-' + getInitial(team.team)} key={team.team}>
                                    <div className="team-icon-sheld">
                                        <span className={'team-icon b-large-' + getInitial(team.team)}>icon</span>
                                    </div>
                                    <div className="team-name">{team.team}</div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                        <div className="squard-wrapper fadeInDown">
                            <div className="wrapper popup-wrapper">
                                <div className="squard-content">
                                    <h5 className="squard-heading">{this.state.selectedTeamName} <span>squard for season of </span>{this.state.selectedSeason}</h5>
                                    <h5 className="squard-subheading">Batsmans</h5>
                                    <div className="d-flex flex-wrap squard-container cw-white-scroll">
                                        {this.state.batsmansRow.map((batsman, index) => (
                                            <div className="team-name batsman" key={index}>
                                                <span className="batsman-logo"></span>
                                                {batsman}
                                            </div>
                                        ))}
                                    </div>
                                    <h5 className="squard-subheading">Bowlers</h5>
                                    <div className="d-flex flex-wrap squard-container cw-white-scroll">
                                        {this.state.bowlersRow.map((bowler, index) => (
                                            <div className="team-name bowler" key={index}>
                                                <span className="bowler-logo"></span>
                                                {bowler}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </section>
        );
    }
}

TeamComponent.propTypes = {
    addTean: PropTypes.func
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
        allMatches: state.matches.data,
        favoriteTeam: state.user.favoriteTeam,
        batsmans: state.matches.batsmans,
        bowlers: state.matches.bowlers
    };
};

TeamComponent.propTypes = {
    actions: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(TeamComponent);