import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as userActions from "../actions/userActions";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

import { getRunRate } from '../commonService/utility'

class DashboardChartComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      bothTeamData: [],
      innings1Data: [],
      innings2Data: [],
      innings1BatsmanData: [],
      innings1BowlerData: [],
      innings2BatsmanData: [],
      innings2BowlerData: [],
      team1: '',
      team2: '',
      runrateData: []
    };
  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {
    this.populateData();
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.deliveries !== newProps.deliveries) {
      this.populateData();
    }
  }

  populateData() {
    const { innings1, innings2, bothTeamsData } = this.props;
    this.setState({ bothTeamData: bothTeamsData });
    this.setState({ innings1Data: innings1 });
    this.setState({ innings2Data: innings2 });
    this.setState({ innings1BatsmanData: innings1.batsmanData });
    this.setState({ innings1BowlerData: innings1.bowlerData });
    this.setState({ innings2BatsmanData: innings2.batsmanData });
    this.setState({ innings2BowlerData: innings2.bowlerData });
    this.setState({ team1: innings1.team });
    this.setState({ team2: innings2.team });
    const runrate = [
      { team: innings1.team, rate: getRunRate(innings1.totalrun, innings1.overPlayed) },
      { team: innings2.team, rate: getRunRate(innings2.totalrun, innings2.overPlayed) },
    ]
    this.setState({ runrateData: runrate });
  }

  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
      <section className="chart">
        <h5 className="chart-content-heading">{this.state.team1} <span>Innings</span></h5>
        <div className="row m-0 chart-wrapper">
          <div className="col-lg-6">
            <div className="wrapper cw-chart" style={{ width: '100%', height: 300 }}>
              <h5 className="chart-subheading">Batting Performance</h5>
              <ResponsiveContainer>
                <BarChart
                  height={300}
                  data={this.state.innings1BatsmanData}
                  margin={{
                    top: 5, right: 0, left: 0, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey="batsman" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="runs" fill="#1A4C68" />
                  <Bar dataKey="ball" fill="#F07B34" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-lg-6 p-0">
            <div className="wrapper cw-chart" style={{ width: '100%', height: 300 }}>
              <h5 className="chart-subheading">Bowling Performance</h5>
              <AreaChart
                height={300}
                width={500}
                data={this.state.innings1BowlerData}
                margin={{
                  top: 10, right: 0, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="bowler" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="wicket" stackId="1" stroke="#e21414" fill="#FB1D1A" />
                <Area type="monotone" dataKey="dots" stackId="1" stroke="#ffc658" fill="#ffc658" />
                <Area type="monotone" dataKey="run" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </div>
          </div>
        </div>
        <h5 className="chart-content-heading">{this.state.team2} <span>Innings</span></h5>
        <div className="row m-0 chart-wrapper">
          <div className="col-lg-6">
            <div className="wrapper cw-chart" style={{ width: '100%', height: 300 }}>
              <h5 className="chart-subheading">Batting Performance</h5>
              <ResponsiveContainer>
                <BarChart
                  height={300}
                  data={this.state.innings2BatsmanData}
                  margin={{
                    top: 5, right: 0, left: 0, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey="batsman" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="runs" fill="#1A4C68" />
                  <Bar dataKey="ball" fill="#F07B34" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-lg-6 p-0">
            <div className="wrapper cw-chart" style={{ width: '100%', height: 300 }}>
              <h5 className="chart-subheading">Bowling Performance</h5>
              <AreaChart
                height={300}
                width={500}
                data={this.state.innings2BowlerData}
                margin={{
                  top: 10, right: 0, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="bowler" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="wicket" stackId="1" stroke="#e21414" fill="#FB1D1A" />
                <Area type="monotone" dataKey="dots" stackId="1" stroke="#ffc658" fill="#ffc658" />
                <Area type="monotone" dataKey="run" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </div>
          </div>
        </div>
      </section>
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
    deliveries: state.matches.deliveries
  };
};

DashboardChartComponent.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardChartComponent);
