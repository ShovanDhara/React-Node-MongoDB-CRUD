import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as matchActions from '../actions/matchActions';
import Chart from "chart.js";
import _ from 'underscore'

class DeliveriesChartComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      team1: '',
      team2: '',
      match: []
    };
    this.overByOverChartRef = React.createRef();
    this.scoreChartRef = React.createRef();
  }

  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {
    this.overChart = this.overByOverChartRef.current.getContext("2d");
    this.scoreChart = this.scoreChartRef.current.getContext("2d");
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.deliveries !== newProps.deliveries) {
      this.populateData();
      this.loadOverByOverChart();
      this.loadScoreChart();
    }
  }

  populateData() {
    const { innings1, innings2, bothTeamsData } = this.props;
    this.setState({ team1: innings1.team });
    this.setState({ team2: innings2.team });
  }

  loadOverByOverChart() {
    const { selectedMatchId, innings1, innings2 } = this.props;
    const matchDeliveries = _.where(this.props.deliveries, { match_id: Number(selectedMatchId) });
    const labels = [];
    const team1Runs = [];
    const team2Runs = [];
    for (let index = 1; index <= 20; index++) {
      labels.push('Over ' + index.toString());
      const overData = matchDeliveries.filter(i => i.over === index && i.inning === 1);
      const runs = 0;
      _.each(overData, function (o) { runs += o.total_runs });
      team1Runs.push(runs);

      overData = matchDeliveries.filter(i => i.over === index && i.inning === 2);
      runs = 0;
      _.each(overData, function (o) { runs += o.total_runs });
      team2Runs.push(runs);
    }

    new Chart(this.overChart, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: innings1.team,
            data: team1Runs,
            backgroundColor: '#58508d',
          },
          {
            label: innings2.team,
            data: team2Runs,
            backgroundColor: '#bc5090',
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Match Report - Runs scored over-by-over'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    });
  }

  loadScoreChart() {
    const { selectedMatchId, innings1, innings2 } = this.props;
    const matchDeliveries = _.where(this.props.deliveries, { match_id: Number(selectedMatchId) });
    const labels = [];
    const team1RunsDataSet = [];
    const team2RunsDataSet = [];
    let team1Runs = 0;
    let team2Runs = 0;

    for (let index = 1; index <= 20; index++) {
      labels.push('Over ' + index.toString());
      const overData = matchDeliveries.filter(i => i.over === index && i.inning === 1);

      _.each(overData, function (o) { team1Runs += o.total_runs });
      team1RunsDataSet.push(team1Runs);

      overData = matchDeliveries.filter(i => i.over === index && i.inning === 2);
      _.each(overData, function (o) { team2Runs += o.total_runs });
      team2RunsDataSet.push(team2Runs);
    }

    new Chart(this.scoreChart, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: innings1.team,
            data: team1RunsDataSet,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
          },
          {
            label: innings2.team,
            data: team2RunsDataSet,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Match Report - Run chase graph'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    });
  }

  render() {
    return (
      <section className="chart">
        <div className="row m-0 chart-wrapper">
          <div className="col-lg-12 mb-4">
            <canvas id="chart2" ref={this.scoreChartRef} />
          </div>
          <hr />
          <div className="col-lg-12">
            <canvas id="chart1" ref={this.overByOverChartRef} />
          </div>
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(matchActions, dispatch)
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    deliveries: state.matches.deliveries
  };
};

DeliveriesChartComponent.propTypes = {
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveriesChartComponent);
