import * as types from '../actions/actionTypes';

const actionTypeEndsInSuccess = (type) => {
    return type.substring(type.length - 8) === '_SUCCESS';
}

const ajaxCallsInProgress = (state = 0, action) => {
    if (action.type === types.BEGIN_AJAX_CALL) {
        return state + 1;
    } else if (action.type === types.AJAX_CALL_ERROR || actionTypeEndsInSuccess(action.type)) {
        let setstate = state - 1;
        return setstate < 0 ? 0 : setstate
    }
    return state;
}

export default ajaxCallsInProgress