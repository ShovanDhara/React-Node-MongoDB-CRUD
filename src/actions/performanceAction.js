
import * as types from './actionTypes';
import PerformanceApi from '../api/performanceApi';
import { beginAjaxCall, ajaxCallError, ajaxCallSuccess } from './ajaxCallStatusAction';
import { statusIsError, statusIsSuccess } from './statusAction'

export const getPerformanceDataSuccess = (performance_data) => {
    return { type: types.PERFORMANCE_GET_SUCCESS, performance_data };
}

export const getPerformanceData = (seasons,batting_team,playerType) => {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());
        return PerformanceApi.getPerformanceData(seasons,batting_team,playerType).then(performances => {
            if (performances.data) {
                dispatch(ajaxCallSuccess());
                return performances.data;
                //dispatch(statusIsSuccess('Deliveries loaded successfully'));
            }
        }).catch(error => {
            //dispatch(getAllMatchesError());
            dispatch(statusIsError(error));
            dispatch(ajaxCallError());
        });
    };
};