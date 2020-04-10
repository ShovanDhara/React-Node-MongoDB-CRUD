import * as types from './actionTypes';
import MatchApi from '../api/matchApi';
import { beginAjaxCall, ajaxCallError, ajaxCallSuccess } from './ajaxCallStatusAction';
import { statusIsError, statusIsSuccess } from './statusAction';

export const getAllMatchesSuccess = (matches) => {
    return { type: types.LOAD_MATCHES_SUCCESS, matches };
}
export const getAllMatchesError = () => {
    return { type: types.LOAD_MATCHES_ERROR };
}
export const getAllDeliveriesSuccess = (deliveries) => {
    return { type: types.GET_DELIVERIES_SUCCESS, deliveries };
}
export const getMatchDataSuccess = (match_data) => {
    return { type: types.MATCH_GET_SUCCESS, match_data };
}
export const updateMatchDataSuccess = (match_data) => {
    return { type: types.MATCH_UPDATE_SUCCESS, match_data };
}
export const addMatchDataSuccess = (match_data) => {
    return { type: types.MATCH_ADD_SUCCESS, match_data };
}
export const loadTeamDataSuccess = (teamData) => {
    return { type: types.LOAD_TEAM_DATA_SUCCESS, teamData };
}

export const loadAllMatches = () => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        let matchData = [];
        let wicketData = [];
        let runData = []
        return MatchApi.getAllMatches().then(matches => {
            if (matches.data) {
                matchData = matches.data
                // console.log([matchData, runData, wicketData])
                MatchApi.getTotalRunByMatch().then(data => {
                    if (data.data) {
                        runData = data.data;
                        MatchApi.getTotalWicketByMatch().then(data => {
                            if (data.data) {
                                let wicketData = data.data;
                                // console.log([matchData, runData, wicketData])
                                if (matchData.length > 0 && runData.length > 0, wicketData.length > 0) {
                                    matchData.forEach((match) => {
                                        let team1TotalRun = runData.find(data => {
                                            if (data._id.match_id === match.id && match.team1 === data._id.batting_team) {
                                                return data.total_run
                                            }
                                        })
                                        let team1TotalWicket = wicketData.find(data => {
                                            if (data._id.match_id === match.id && match.team2 === data._id.batting_team) {
                                                return data.total_wicket
                                            }
                                        })
                                        let team2TotalRun = runData.find(data => {
                                            if (data._id.match_id === match.id && match.team2 === data._id.batting_team) {
                                                return data.total_run
                                            }
                                        })
                                        let team2TotalWicket = wicketData.find(data => {
                                            if (data._id.match_id === match.id && match.team2 === data._id.batting_team) {
                                                return data.total_wicket
                                            }
                                        })
                                        if (team1TotalRun && team1TotalWicket && team2TotalRun && team2TotalWicket) {
                                            match.team1TotalRun = team1TotalRun.total_run;
                                            match.team2TotalRun = team2TotalRun.total_run;
                                            match.team1TotalWicket = team1TotalWicket.total_wicket ? team1TotalWicket.total_wicket : 0;
                                            match.team2TotalWicket = team2TotalWicket.total_wicket ? team2TotalWicket.total_wicket : 0;
                                        }
                                    })
                                    dispatch(getAllMatchesSuccess(matchData));
                                }
                            }
                        })

                    }
                })

            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};

export const loadAllTeamMember = (payload) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        let batsman = [];
        let bowler = []
        return MatchApi.getBatsman(payload).then(matches => {
            if (matches.data) {
                batsman = {...matches.data[0]}
                return MatchApi.getBowler(payload).then(bowlers => {
                    if (bowlers.data) {
                        bowler = {...bowlers.data[0]};
                        let allData = {
                            batsmans: batsman,
                            bowlers: bowler
                        }
                        dispatch(loadTeamDataSuccess(allData));
                    }
                })
            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};

export const getAllDeliveries = (matchid) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return MatchApi.getDeliveries(matchid).then(deliveries => {
            if (deliveries.data) {
                dispatch(getAllDeliveriesSuccess(deliveries.data));
                // dispatch(statusIsSuccess('Deliveries loaded successfully'));
            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};

export const getMatchData = (matchid) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return MatchApi.getMatch(matchid).then(match => {
            if (match.data) {
                dispatch(ajaxCallSuccess());
                return match.data[0];
            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};
export const addMatch = (payload) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return MatchApi.addMatch(payload).then(match => {
            if (match.data) {
                dispatch(statusIsSuccess('Match added successfully'));
            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};
export const deleteMatch = (matchid) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return MatchApi.deleteMatch(matchid).then(match => {
            if (match.data) {
                dispatch(statusIsSuccess(`${match.data} Match deleted successfully`));
            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};
export const updateMatch = (payload, matchid) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return MatchApi.updateMatch(payload, matchid).then(match => {
            if (match.data) {
                dispatch(statusIsSuccess('Match Updated successfully'));
            }
        }).catch(error => {
            dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};