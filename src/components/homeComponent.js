import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as matchActions from "../actions/matchActions";
import Button from "@material-ui/core/Button";
import CarouselComponent from './common/carousel'
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import TablePaginationActionComponent from "./common/paginationActionComponent";
import SelectInput from "./common/selectBoxComponent";
import TextField from "@material-ui/core/TextField";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { getInitial } from '../commonService/utility'
import StorageIcon from '@material-ui/icons/Storage';

class HomeComponent extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      seasons: [],
      selectedSeason: "",
      searchField: "",
      rows: [],
      rowsPerPage: 20,
      page: 0,
      setPage: 0
    };
    this.viewDetails = this.viewDetails.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleFilterSearch = this.handleFilterSearch.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSeasonSelectionChange = this.onSeasonSelectionChange.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.editMatch = this.editMatch.bind(this);
    this.deleteMatch = this.deleteMatch.bind(this);
    this.loadMatches = this.loadMatches.bind(this);
    this.onTeamSelectionChange = this.onTeamSelectionChange.bind(this);
    this.modifyListing = this.modifyListing.bind(this);
  }
  static get contextTypes() {
    return {
      router: PropTypes.object.isRequired
    };
  }
  componentDidMount() {
    if (this.props.allMatches) {
      this.modifyListing(this.props.allMatches);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.allMatches !== prevProps.allMatches) {
      this.modifyListing(this.props.allMatches);
    }
    if (this.props.favoriteTeam !== prevProps.favoriteTeam) {
      this.modifyListing(this.props.allMatches);
    }
  }

  modifyListing(rows) {
    if (this.props.favoriteTeam) {
      let filtermatches = [];
      let filterArrayIndex = [];
      let currenntRow = [...rows];
      currenntRow.forEach((match) => {
        if (match.winner === this.props.favoriteTeam) {
          filtermatches.push(match);
          currenntRow.splice(currenntRow.indexOf(match), 1);
          currenntRow.unshift(match);
        }
      })
      this.setState({ rows: [...currenntRow] });
    } else {
      this.setState({ rows: [...rows] });
    }
  }

  viewDetails(matchid) {
    this.context.router.history.push("/dashboard/" + matchid);
  }
  editDelivery(id) {
    this.context.router.history.push("/delivery/" + id);
  }
  editMatch(id) {
    this.context.router.history.push("/match/" + id);
  }
  deleteMatch(matchid) {
    this.props.actions.deleteMatch(matchid);
  }

  loadMatches() {
    this.setState({ searchField: "" });
    this.props.actions.loadAllMatches().then(res => {
      if (this.props.allMatches) {
        this.modifyListing(this.props.allMatches);
      }
    });
  }

  handleChangePage(event, newPage) {
    this.setState({ setPage: newPage });
  }
  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: parseInt(event.target.value) });
    this.setState({ setPage: 0 });
  }
  handleFilterSearch(event) {
    const value = event.target.value;
    this.setState({ searchField: value });
    if (value === "" && this.state.selectedSeason === "") {
      this.setState({ rows: this.props.allMatches });
    }
  }

  convetToDate(date) {
    if (date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      if (date.length === 8) {
        return new Date('20' + date.substr(6, 2), date.substr(3, 2) - 1, date.substr(0, 2)).toLocaleDateString('en', options);
      } else {
        return new Date(date).toLocaleDateString('en', options);
      }
    }
  }

  resetFilter() {
    this.setState({ selectedSeason: "" });
    this.setState({ searchField: "" });
    this.modifyListing(this.props.allMatches);
  }

  onSearchClick() {
    this.setState({ rows: '' });
    let filteredRow = this.props.allMatches.filter(item => {
      if (item) {
        return (
          item.team1
            .toLowerCase()
            .includes(this.state.searchField.toLowerCase()) ||
          item.team2
            .toLowerCase()
            .includes(this.state.searchField.toLowerCase())
        );
      }
    });
    if (this.state.selectedSeason !== "") {
      filteredRow = filteredRow.filter(item => {
        if (item) {
          return item.season === this.state.selectedSeason;
        }
      });
    }
    if (filteredRow.length) this.modifyListing(filteredRow);
  }

  onSeasonSelectionChange(event) {
    this.setState({ selectedSeason: event.target.value });
  }
  onTeamSelectionChange(event) {
    this.setState({ searchField: event.target.value });
  }

  render() {
    return (
      <section>
        {/* Home top slider */}
        <CarouselComponent />
        <section className="home-main-wrapper">
          <div className="clearfix tran-container container home-form-container">
            <div className="row">
              <div className="col-lg-4 cw-form-control">
                <div className="form-group m-0">
                  <SelectInput
                    id="team-select"
                    name="seasons"
                    value={this.state.searchField}
                    options={this.props.teams}
                    onChange={this.onTeamSelectionChange}
                    placeholder="Filter by Team"
                  />
                </div>
              </div>
              <div className="col-lg-4 cw-form-control">
                <div className="form-group m-0">
                  <SelectInput
                    id="season-select"
                    name="seasons"
                    value={this.state.selectedSeason}
                    options={this.props.seasons}
                    onChange={this.onSeasonSelectionChange}
                    placeholder="Filter by Seasons"
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <Button
                  variant="outlined"
                  className="w-100 cw-btn-form"
                  onClick={this.onSearchClick}
                >
                  Search
                </Button>
              </div>
              <div className="col-lg-2">
                <Button
                  variant="outlined"
                  className="w-100 cw-btn-form"
                  onClick={this.resetFilter}
                >
                  Reset
                </Button>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                {this.props.isAdmin &&
                  <Button
                    variant="outlined"
                    className="w-100 cw-btn-form mt-3"
                    onClick={() => { this.context.router.history.push("/match"); }}>
                    Add Match
                </Button>
                }
              </div>
            </div>

          </div>
          <div className="container p-0">
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
          {this.state.rows.length > 0 && (
            <div className="match-section container cw-white-scroll">
              {this.state.rows.slice(
                this.state.setPage * this.state.rowsPerPage,
                this.state.setPage * this.state.rowsPerPage +
                this.state.rowsPerPage
              ).map(row => (
                <div className="match-item" key={row._id}>
                  <div className="match-date">{this.convetToDate(row.date)}</div>
                  <div className="match-content d-flex">
                    <div className="match-icons d-flex">
                      <IconButton size="small" aria-label="add" title="Go to dashboard" onClick={() => this.viewDetails(row.id)}>
                        <DashboardIcon />
                      </IconButton>
                      {this.props.isAdmin &&
                        <IconButton size="small" className="ml-1" aria-label="edit" title="Edit delivery" onClick={() => this.editDelivery(row.id)}>
                          <StorageIcon />
                        </IconButton>
                      }
                      {this.props.isAdmin &&
                        <IconButton size="small" className="ml-1" aria-label="edit" title="Edit match" onClick={() => this.editMatch(row.id)}>
                          <EditIcon />
                        </IconButton>
                      }{this.props.isAdmin &&
                        <IconButton size="small" className="ml-1" aria-label="delete" title="Delete match" onClick={() => this.deleteMatch(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    </div>
                    <div className="match-data team-section">
                      <div className="team-wrapper d-flex mb-1">
                        <span className={'team-icon b-' + getInitial(row.team1)}></span>
                        <span className="team-name">{row.team1}</span>
                        <span className={row.winner === row.team1 ? 'iswinner winner' : 'winner'}></span>
                      </div>
                      <div className="team-wrapper d-flex">
                        <span className={'team-icon b-' + getInitial(row.team2)}></span>
                        <span className="team-name">{row.team2}</span>
                        <span className={row.winner === row.team2 ? 'iswinner winner' : 'winner'}></span>
                      </div>
                    </div>
                    <div className="match-data">
                      <div className="score-wrapper d-flex">
                        <span className="score">
                          <span className="font-weight-bold"><span>{row.team1TotalRun}</span>/<span>{row.team1TotalWicket}</span></span>
                          {/* <span className="over">20/20</span> */}
                        </span>
                      </div>
                      <div className="score-wrapper d-flex">
                        <span className="score">
                          <span className="font-weight-bold"><span>{row.team2TotalRun}</span>/<span>{row.team2TotalWicket}</span></span>
                          {/* <span className="over">20/20</span> */}
                        </span>
                      </div>
                    </div>
                    <div className="match-data">
                      <div className="pom-wrapper">
                        <div className="font-weight-bold">Player of the match</div>
                        <span className="player-name">{row.player_of_match}</span>
                      </div>
                    </div>
                    <div className="match-data">
                      <div className="winner-wrapper pb-1">
                        <span className="font-weight-bold">
                          {row.winner} own by {row.win_by_runs !== 0 && <span>{row.win_by_runs} <span>run</span></span>}
                          {row.win_by_wickets !== 0 && <span>{row.win_by_wickets} <span>wicket</span></span>}
                        </span>
                      </div>
                      <div className="toss-wrapper">
                        <span className="pr-1 font-weight-bold">Toss winner: </span><span className="pr-4">{row.toss_winner}</span>
                        <span className="pr-1 font-weight-bold">Toss Decision: </span><span>{row.toss_decision === 'field' ? 'Fielding' : 'Bowling'}</span>
                      </div>
                      <div className="toss-wrapper">
                        <span className="pr-1 font-weight-bold">Venue: </span><span className="pr-4">{row.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!this.state.rows &&
            <div className="alert container alert-warning text-center mt-4" role="alert">
              No data available
                    </div>
          }
        </section>
      </section>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    allMatches: state.matches.data,
    isLoggedIn: state.user.isLoggedIn,
    isAdmin: state.user.isAdmin,
    deliveries: state.matches.deliveries,
    seasons: state.matches.seasons,
    teams: state.matches.teams,
    favoriteTeam: state.user.favoriteTeam
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(matchActions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
