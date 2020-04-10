import * as types from '../actions/actionTypes';
import { generateSeasonOptions, generateTeamNames, tossDecision, umpires, cities, venues,playerType } from '../commonService/listItems'

const initialState = {
    data: [],
    deliveries: [],
    seasons: generateSeasonOptions(),
    teams: generateTeamNames(),
    tossDecision: tossDecision(),
    umpires: umpires(),
    cities: cities(),
    venues: venues(),
    playerType: playerType(),
    batsmans: [],
    bowlers: []
}
const matches = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_MATCHES_SUCCESS:
            return {
                ...state,
                data: action.matches
            }
        case types.LOAD_MATCHES_ERROR:
            return {
                ...state,
                data: [],
                deliveries: []
            }
        case types.GET_DELIVERIES_SUCCESS:
            return {
                ...state,
                deliveries: action.deliveries
            }
        case types.LOAD_TEAM_DATA_SUCCESS:
            return {
                ...state,
                batsmans: action.teamData.batsmans,
                bowlers: action.teamData.bowlers
            }

        default:
            return state;
    }
}

export default matches