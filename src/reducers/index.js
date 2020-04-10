import { combineReducers } from 'redux';
import user from './userReducer';
import matches from './matchReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import requestState from './statusReducer';

const rootReducer = combineReducers({
    user,
    matches,
    ajaxCallsInProgress,
    requestState
});

export default rootReducer;