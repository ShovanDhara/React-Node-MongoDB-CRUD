import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as matchActions from '../actions/matchActions';
import * as performanceActions from '../actions/performanceAction';
import * as userActions from "../actions/userActions";
import SelectInput from "./common/selectBoxComponent";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import MatchApi from '../api/matchApi';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'

class playerScorecardComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

            selectedSeason: "",
            selectTeam: "",
            selectPlayerType: "",
            batsman: [],
            bowler: [],
            team: [],
            totalWin:0,
            win: 0,
            toss: 0,
            loss: 0,
            playerType:['Batting','Bowling'],
            uniqueTeams:[]

        }
        this.onSeasonSelectionChange = this.onSeasonSelectionChange.bind(this);
        this.onTeamSelectionChange = this.onTeamSelectionChange.bind(this);
        this.onPlayerTypeSelectionChange = this.onPlayerTypeSelectionChange.bind(this);
        this.populateData = this.populateData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(event) {
        event.preventDefault();
        this.populateData();

    }
    componentDidMount() {
        let uniqueTeamList=[];
        let teamList=[];
        MatchApi.getAllMatches().then(matches =>{

            if (matches.data) {
			    matches.data.filter(item => {
                if (!teamList.includes(item.team1) && item.team1 != '')
					teamList.push(item.team1);

            });
            teamList.sort().map((filter) => {
				uniqueTeamList.push({ text: filter, value: filter });
            });
            this.setState({uniqueTeams: uniqueTeamList});
            }
            
        });

        let selectedLoadTeam;
        let selectedLoadSeason;
        let selectedLoadPlayerType = 'team';
        let favTeam = this.props.favoriteTeam;
        if (favTeam && this.props.seasons &&
            this.props.seasons.length > 0) {
            selectedLoadTeam = favTeam;
            selectedLoadSeason = this.props.seasons[this.props.seasons.length - 1].value;

        }
        else {
            if (this.props.teams && this.props.teams.length > 0 && this.props.seasons &&
                this.props.seasons.length > 0) {

                selectedLoadTeam = this.props.teams[this.props.teams.length - 1].value;
                selectedLoadSeason = this.props.seasons[this.props.seasons.length - 1].value;
            }
        }
        this.setState({ selectedSeason: selectedLoadSeason });
        this.setState({ selectTeam: selectedLoadTeam });

        this.props.actions.getPerformanceData(selectedLoadSeason, selectedLoadTeam, selectedLoadPlayerType).then(data => {
            let winCount = 0;
            let tossCount = 0;
            let winnerCount = 0;
            let winPercentage = 0;
            let countWin=0;
            let countToss=0;
            
            if (data) {
                
                data.map((d,index) => {
                   
                    countWin=d.winner=="Win" ? 1 : 0;
                    countToss=d.toss=="Win" ? 1 : 0;
                    tossCount = tossCount +countWin;
                    winnerCount = winnerCount + countToss;
                    data[index]['Win Count']=countWin;
                    data[index]['Toss Count']=countToss;
                    
                });
            }

            let lossCount = 0;
            lossCount = parseInt(data.length) - parseInt(winnerCount);
            winPercentage = (parseInt(winnerCount) * 100) / parseInt(data.length);
            this.setState({ win: winPercentage.toFixed(2) });
            this.setState({ toss: tossCount });
            this.setState({ loss: lossCount });
            this.setState({totalWin : winnerCount});
            this.setState({ team: [] });
            this.setState({ team: data });

        });

    }
    populateData() {
        let selectedLoadPlayerType = 'team';
        if (!this.state.selectPlayerType && this.state.selectPlayerType == '') {
            this.setState({ selectPlayerType: selectedLoadPlayerType });
        }
        this.props.actions.getPerformanceData(this.state.selectedSeason, this.state.selectTeam, this.state.selectPlayerType != '' ? this.state.selectPlayerType : selectedLoadPlayerType).then(data => {
            if (data) {
                this.setState({ batsman: [] });
                this.setState({ bowler: [] });
                this.setState({ team: [] });
                if (this.state.selectPlayerType == 'bat') {
                    this.setState({ batsman: data });
                }
                else if (this.state.selectPlayerType == 'field') {
                    this.setState({ bowler: data });
                }
                else {
                let winCount = 0;
                let tossCount = 0;
                let winnerCount = 0;
                let winPercentage = 0;
                let countWin=0;
                let countToss=0;
                if (data) {
                    data.map((d,index) => {
                        countWin=d.winner=="Win" ? 1 : 0;
                        countToss=d.toss=="Win" ? 1 : 0;
                        tossCount = tossCount + countToss;
                        winnerCount = winnerCount + countWin;
                        data[index]['Win Count']=countWin;
                        data[index]['Toss Count']=countToss;
                    });
                }

                let lossCount = 0;
                if (data && data.length > 0)
                    lossCount = parseInt(data.length) - parseInt(winnerCount);
                if (data && data.length > 0)
                    winPercentage = (parseInt(winnerCount) * 100) / parseInt(data.length);
                this.setState({ win: winPercentage.toFixed(2) });
                this.setState({ toss: tossCount });
                this.setState({ loss: lossCount });
                // this.setState({ team: [] });
                this.setState({ team: data });

            }
                
            }
            
        });

    }

    onSeasonSelectionChange(event) {
        this.setState({ selectedSeason: event.target.value });

    }
    onTeamSelectionChange(event) {
        this.setState({ selectTeam: event.target.value });

    }
    onPlayerTypeSelectionChange(event) {
        this.setState({ selectPlayerType: event.target.value });

    }
    handleChange(event) {
        const fieldName = event.target.name;
    }

    render() {
        const CustomTooltip = ({ payload, label, active }) => {
            if (active) {
                return (
                    <div className="custom-tooltip">
                      
                         
                        <p className="desc">Anything you want can be displayed here.</p>
                    </div>
                );
            }
            return null;
        }
        return (
            <section>
                <div className="inner-page-wrapper">
                    <div className="inner-page-header">
                        <div className="inner-page-header-wrapper">
                            <h5 className="page-heading">Player Scorecard</h5>
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
                                        <div className="col-lg-3">
                                            <div className="form-group cw-form-control">
                                                <SelectInput
                                                    id="team-select"
                                                    name="city"
                                                    value={this.state.selectTeam}
                                                    options={this.state.uniqueTeams}
                                                    onChange={this.onTeamSelectionChange}
                                                    placeholder="Teams"
                                                />

                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group cw-form-control">
                                                <SelectInput
                                                    id="player-type-select"
                                                    name="city"
                                                    value={this.state.selectPlayerType}
                                                    options={this.props.playerType}
                                                    onChange={this.onPlayerTypeSelectionChange}
                                                    placeholder="Player type"
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
                        <div className="ipl-team-wrapper white-bg d-flex">
                            <section className="container pb-5">
                                <div className="row w-100">
                                    <div className="col-lg-12 pb-5">
                                        <div className="wrapper cw-chart pb-5 chart-wrapper" style={{ width: '100%', height: 500 }}>
                                            {this.state.team.length > 0 &&
                                                <section className="team-info-data chart">
                                                    <h5 className="chart-content-heading">Team Performance</h5>
                                                    <div className="d-flex align-items-center justify-content-center">

                                                        
                                                        <div className="sc-info">
                                                            Total Win:  <span className="sc-info-value">{this.state.totalWin}</span>
                                                        </div>
                                                        <div className="sc-info">
                                                            Winning Percentage:  <span className="sc-info-value">{this.state.win}<span>%</span></span>
                                                        </div>
                                                        <div className="sc-info">
                                                            Toss Won:  <span className="sc-info-value">{this.state.toss}</span>
                                                        </div>
                                                        <div className="sc-info">
                                                            Loss Count:  <span className="sc-info-value">{this.state.loss}</span>
                                                        </div>
                                                    </div>
                                                </section>
                                            }
                                            {this.state.batsman.length > 0 &&
                                                <section className="team-info-data chart">
                                                    <h5 className="chart-content-heading">Team Batting Performance</h5>
                                                </section>
                                            }
                                            {this.state.batsman && this.state.batsman.length > 0 &&
                                                <ResponsiveContainer>
                                                    <BarChart
                                                        height={300}
                                                        data={this.state.batsman}
                                                        margin={{
                                                            top: 5, right: 0, left: 0, bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="1 1" />
                                                        <XAxis dataKey="_id.batsman" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="TotalRuns" stackId="a" fill="#9FDA3A" />
                                                        <Bar dataKey="strikeRate" stackId="a" fill="#4AC16D" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            }
                                            {this.state.bowler.length > 0 &&
                                                <section className="team-info-data chart">
                                                    <h5 className="chart-content-heading">Team Bowling Performance</h5>
                                                </section>
                                            }
                                            {this.state.bowler && this.state.bowler.length > 0 &&
                                                <ResponsiveContainer>
                                                    <BarChart
                                                        height={300}
                                                        data={this.state.bowler}
                                                        margin={{
                                                            top: 5, right: 0, left: 0, bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="1 1" />
                                                        <XAxis dataKey="_id.bowler" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="TotalRunsGivenPerInnings" stackId="a" fill="#44307D" />
                                                        {/* <Bar dataKey="strikeRate" stackId="a" fill="#9FDA3A" /> */}
                                                        <Bar dataKey="WicketsTaken" stackId="a" fill="#ED4135" />
                                                        <Bar dataKey="Ball" stackId="a" fill="#47CE3B" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            }

                                            {this.state.team && this.state.team.length > 0 &&
                                                <ResponsiveContainer>
                                                    <BarChart
                                                        height={300}
                                                        data={this.state.team}
                                                        margin={{
                                                            top: 5, right: 0, left: 0, bottom: 20,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="1 1" />
                                                        <XAxis dataKey="against" />
                                                        <YAxis  />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="Win Count" fill="#365C8D" />
                                                        <Bar dataKey="Toss Count" fill="#9FDA3A" />
                                                       
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            }
                                            {!this.state.team.length && !this.state.bowler.length && !this.state.batsman.length &&
                                                <div className="alert alert-warning text-center mt-4" role="alert">
                                                    No data available
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                </div>
            </section>
        );


    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(performanceActions, dispatch)
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        venues: state.matches.venues,
        seasons: state.matches.seasons,
        teams: state.matches.teams,
        tossDecision: state.matches.tossDecision,
        favoriteTeam: state.user.favoriteTeam,
        playerType: state.matches.playerType

    };
};
playerScorecardComponent.propTypes = {
    actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(playerScorecardComponent);