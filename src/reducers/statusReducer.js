import * as types from '../actions/actionTypes';
const initialState = {
    error: false,
    errorMsg: '',
    success: false,
    successMsg: ''
}
const requestState = (state = initialState, action) => {
    switch (action.type) {
        case types.STATUS_ERROR:
            return {
                ...state,
                error: true,
                errorMsg: action.data,
                success: false,
                successMsg: ''
            }
        case types.STATUS_SUCCESS:
            return {
                ...state,
                error: false,
                errorMsg: '',
                success: true,
                successMsg: action.data
            }
        case types.STATUS_RESET:
            return {
                ...state,
                error: false,
                errorMsg: '',
                success: false,
                successMsg: ''
            }
        default:
            return state;
    }
}

export default requestState