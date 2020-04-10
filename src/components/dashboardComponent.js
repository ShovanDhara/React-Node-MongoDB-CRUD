import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import * as matchActions from '../actions/matchActions';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PropTypes, { func } from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import TabPanel from './common/tabPanelComponent';
import DashboardChartComponent from './dashboardChartComponent';
import DeliveriesChartComponent from './deliveriesChartComponent';
import {
    getInitial, analyseBall, analyseRun, analyseBallResult,
    getBatsmanData, getBowlerData, getBatsmanAndBowlerData,
    getTotalRunFromDeliveries, getStrikeRate, getEconomyRate,
    getTotalWicketsFromDeliveries, getTotalOverPalyed, getRunRate, getTotalWicketTaken
} from '../commonService/utility'

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableFooter from "@material-ui/core/TableFooter";

// import Chart from "chart.js";
// import _ from 'underscore'

class DashboardComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedMatchID: this.props.match.params.id ? this.props.match.params.id : '',
            team_1_data: {
                teamName: '',
                totalRun: '',
                wickets: '',
                overPlayed: ''
            },
            team_2_data: {
                teamName: '',
                totalRun: '',
                wickets: '',
                overPlayed: ''
            },
            tabIndex: 0,
            match: []

        }
        this.handleTabChange = this.handleTabChange.bind(this);
        this.goToHome = this.goToHome.bind(this);
    }
    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        if (this.state.selectedMatchID) {
            this.props.actions.getAllDeliveries(this.state.selectedMatchID).then(() => {
                if (this.props.deliveries) {
                    this.getMatchDetails();
                    // this.loadOverByOverChart();
                    // this.loadScoreChart();
                }
            });
            this.props.actions.getMatchData(this.state.selectedMatchID).then((data) => {
                if (data) {
                    this.setState({ match: data });
                }
            })
        }
    }

    getMatchDetails() {
        let team_1_set = {}
        let team_2_set = {}
        for (let delivery of this.props.deliveries) {
            if (delivery.batting_team && delivery.bowling_team) {
                const team_1 = delivery.batting_team;
                team_1_set['teamName'] = delivery.batting_team
                team_1_set['totalRun'] = getTotalRunFromDeliveries(this.props.deliveries, delivery.batting_team);
                team_1_set['wickets'] = getTotalWicketsFromDeliveries(this.props.deliveries, delivery.batting_team);
                team_1_set['overPlayed'] = getTotalOverPalyed(this.props.deliveries, delivery.batting_team)
                this.setState({ team_1_data: team_1_set });

                const team_2 = delivery.bowling_team;
                team_2_set['teamName'] = delivery.bowling_team
                team_2_set['totalRun'] = getTotalRunFromDeliveries(this.props.deliveries, delivery.bowling_team);
                team_2_set['wickets'] = getTotalWicketsFromDeliveries(this.props.deliveries, delivery.bowling_team);
                team_2_set['overPlayed'] = getTotalOverPalyed(this.props.deliveries, delivery.bowling_team)
                this.setState({ team_2_data: team_2_set });
                break;
            }
        }
    }

    goToHome() {
        this.context.router.history.push('/');
    }
    handleTabChange(event, newValue) {
        this.setState({ tabIndex: newValue });
    }
    getLineup() {
        if (this.props.deliveries) {
            let teams = [this.state.match.team1, this.state.match.team2];
            let lineups = [];
            for (let team in teams) {
                lineups.push({
                    'teamno': team,
                    'team': teams[team],
                    'batsmanData': getBatsmanAndBowlerData(this.props.deliveries, teams[team], 'batsman'),
                    'bowlerData': getBatsmanAndBowlerData(this.props.deliveries, teams[team], 'bowler'),
                    'totalrun': getTotalRunFromDeliveries(this.props.deliveries, teams[team]),
                    'overPlayed': getTotalOverPalyed(this.props.deliveries, teams[team]),
                    'wickets': getTotalWicketsFromDeliveries(this.props.deliveries, teams[team]),
                    'totalWicketTaken': getTotalWicketTaken(this.props.deliveries, teams[team])
                })
            }
            return lineups
        }
    }

    render() {
        const rows = this.props.deliveries ? this.props.deliveries : [];
        const getBalls = (inningNo, overNo) => {
            const filterBall = this.props.deliveries.filter((data) => {
                if (data.inning === inningNo && data.over === overNo) {
                    return data;
                }
            })
            return filterBall;
        }
        const getOver = (inningNo) => {
            const filteroverData = this.props.deliveries.filter((data) => {
                if (data.inning === inningNo) {
                    return data;
                }
            })
            const filteredover = filteroverData.reduce((obj, current) => {
                const over = obj.find(item => item.over === current.over);
                if (!over) {
                    return obj.concat([
                        {
                            'over': current.over,
                            'bowler': current.bowler,
                            'balls': getBalls(inningNo, current.over)
                        }
                    ])
                } else {
                    return obj;
                }
            }, [])
            return filteredover
        }
        const innings = this.props.deliveries.reduce((obj, current) => {
            const inning = obj.find(item => item.inning === current.inning);
            if (!inning) {
                return obj.concat([
                    {
                        'inning': current.inning,
                        'inningNo': current.inning === 1 ? '1st' : '2nd',
                        'overs': getOver(current.inning)
                    }
                ]);
            } else {
                return obj;
            }
        }, []);

        const teamData = this.getLineup();
        return (
            <section>
                {/* <Fab color="primary" aria-label="add" title="Back to home" className="back-to-home" onClick={this.goToHome}>
                    <KeyboardBackspaceIcon />
                </Fab>  */}
                <div className="dashboard-header">
                    <div className="dashboard-overlay">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 d-flex dash-center-align">
                                    <p className="heading">{this.state.match.winner} won by {this.state.match.win_by_runs !== 0 && <span>{this.state.match.win_by_runs} runs</span>}
                                        {this.state.match.win_by_wickets !== 0 && <span>{this.state.match.win_by_wickets} wickets</span>}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 d-flex dash-center-align">
                                    <div className='team-logo'>
                                        <div className="team-icon-sheld">
                                            <span className={'team-icon b-large-' + getInitial(this.state.team_1_data.teamName)}>icon</span>
                                        </div>
                                    </div>
                                    <div className="team-info team-1">
                                        <ul className="m-0 p-0">
                                            <li className="team-name">{this.state.team_1_data.teamName}</li>
                                            <li className="team-score">
                                                <span>{this.state.team_1_data.totalRun}</span>
                                                <span>/</span>
                                                {this.state.team_1_data.wickets}
                                            </li>
                                            <li>Run rate: <span>{getRunRate(this.state.team_1_data.totalRun, this.state.team_1_data.overPlayed)}</span></li>
                                            <li>Over: <span>{this.state.team_1_data.overPlayed}<span>/20</span></span></li>
                                        </ul>
                                    </div>
                                    <div className="winning-trophy">
                                        <div className="ball"></div>
                                        <span className="player-of-match">Player of the match: <span className="font-weight-bold">{this.state.match.player_of_match}</span></span>
                                    </div>
                                    <div className="team-info team-2">
                                        <ul className="m-0 p-0">
                                            <li className="team-name">{this.state.team_2_data.teamName}</li>
                                            <li className="team-score">
                                                <span>{this.state.team_2_data.totalRun}</span>
                                                <span>/</span>
                                                {this.state.team_2_data.wickets}
                                            </li>
                                            <li>Run rate: <span>{getRunRate(this.state.team_2_data.totalRun, this.state.team_2_data.overPlayed)}</span></li>
                                            <li>Over: <span>{this.state.team_2_data.overPlayed}<span>/20</span></span></li>
                                        </ul>
                                    </div>
                                    <div className='team-logo'>
                                        <div className="team-icon-sheld">
                                            <span className={'team-icon b-large-' + getInitial(this.state.team_2_data.teamName)}>icon</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-body">
                    <div className="row m-0">
                        <div className="col-lg-10 p-0 m-0 cw-tab">
                            <Tabs
                                value={this.state.tabIndex}
                                onChange={this.handleTabChange}
                                indicatorColor="primary">
                                <Tab label="Score Board" />
                                <Tab label="Team Report" />
                                <Tab label="Comparison Report" />
                            </Tabs>
                            <TabPanel value={this.state.tabIndex} index={0}>
                                <div className="tab-wrapper p-4">
                                    {teamData && teamData.length > 0 && teamData.map((team, index) => (
                                        <section className="dash-section" key={team.team + `_` + index}>
                                            <h4 className="tab-content-heading">{team.team} Innings</h4>
                                            <Paper className="table-wapper">
                                                <Table className="cw-table cw-table-large cw-table-batting">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="left"></TableCell>
                                                            <TableCell align="left">Batsman</TableCell>
                                                            <TableCell align="left">Runs</TableCell>
                                                            <TableCell align="left">Balls</TableCell>
                                                            <TableCell align="left">SR</TableCell>
                                                            <TableCell align="left">4s</TableCell>
                                                            <TableCell align="left">6s</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {team.batsmanData.length > 0 && team.batsmanData.map((batsman) => (
                                                            <TableRow key={batsman.batsman + `_` + index}>
                                                                <TableCell align="left"><span className={'player-avatar bat-icon b-player-' + getInitial(batsman.batsman)}>data</span></TableCell>
                                                                <TableCell align="left" className="font-weight-bold">{batsman.batsman}</TableCell>
                                                                <TableCell align="left" className="font-weight-bold">{batsman.runs}</TableCell>
                                                                <TableCell align="left">{batsman.ball}</TableCell>
                                                                <TableCell align="left">{getStrikeRate(batsman.runs, batsman.ball)}</TableCell>
                                                                <TableCell align="left">{batsman.four}</TableCell>
                                                                <TableCell align="left">{batsman.six}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell colSpan={2}>Total</TableCell>
                                                            <TableCell className="font-weight-bold">{team.totalrun} <span>Runs</span></TableCell>
                                                            <TableCell colSpan={5} align="left">{team.overPlayed} <span>overs</span></TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </Paper>
                                            <Paper className="table-wapper mt-4">
                                                <Table className="cw-table cw-table-large cw-table-bowling">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="left"></TableCell>
                                                            <TableCell align="left">Bowler</TableCell>
                                                            <TableCell align="left">Overs</TableCell>
                                                            <TableCell align="left">Runs</TableCell>
                                                            <TableCell align="left">Wickets</TableCell>
                                                            <TableCell align="left">Econ</TableCell>
                                                            <TableCell align="left">Dots</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {team.bowlerData.length > 0 && team.bowlerData.map((bowler, index) => (
                                                            <TableRow key={bowler.bowler + `_` + index}>
                                                                <TableCell align="left"><span className={'player-avatar ball-icon b-player-' + getInitial(bowler.bowler)}>data</span></TableCell>
                                                                <TableCell align="left">{bowler.bowler}</TableCell>
                                                                <TableCell align="left">{bowler.over}</TableCell>
                                                                <TableCell align="left">{bowler.run}</TableCell>
                                                                <TableCell align="left" className="font-weight-bold">{bowler.wicket}</TableCell>
                                                                <TableCell align="left">{getEconomyRate(bowler.over, bowler.run)}</TableCell>
                                                                <TableCell align="left">{bowler.dots}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="right">Total:</TableCell>
                                                            <TableCell colSpan={3} align="left">{team.totalWicketTaken} <span>Wickets</span></TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </Paper>
                                        </section>
                                    ))}
                                </div>
                            </TabPanel>
                            <TabPanel value={this.state.tabIndex} index={1}>
                                <DashboardChartComponent innings1={teamData[0]} innings2={teamData[1]} bothTeamsData={teamData} />
                            </TabPanel>
                            <TabPanel value={this.state.tabIndex} index={2}>
                                <DeliveriesChartComponent innings1={teamData[0]} innings2={teamData[1]}
                                    selectedMatchId={this.state.selectedMatchID} />
                            </TabPanel>
                        </div>
                        <div className="col-lg-2 p-0 m-0">
                            <div className="over-summary-wrapper">
                                {innings.map(inning => (
                                    <div className="innings" key={inning.inning}>
                                        <h5 className="inning-no">{inning.inningNo} <span>Inning</span></h5>
                                        {inning.overs.map(over => (
                                            <div className="over d-flex" key={over.over}>
                                                <div className="over-details d-flex">
                                                    <div className={'player-icon ball-icon b-player-' + getInitial(over.bowler)}></div>
                                                    <div className="player-name d-flex">
                                                        <span>Over <span>{over.over}</span></span>
                                                        <span>{over.bowler}</span>
                                                    </div>
                                                </div>
                                                {over.balls.map(ball => (
                                                    <div className="ball d-flex" key={ball.ball}>
                                                        <span className={'ball-type ' + analyseBall(ball)}>{analyseRun(ball)}</span>
                                                        <span className="ball-desc">{analyseBallResult(ball)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
                {!rows.length &&
                    <div className="alert alert-warning text-center mt-4" role="alert">
                        No data available
                    </div>
                }
            </section>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        deliveries: state.matches.deliveries,
        isLoggedIn: state.user.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(matchActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);