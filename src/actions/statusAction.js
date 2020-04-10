import * as types from './actionTypes';

export const statusIsError = (data) => {
  return { type: types.STATUS_ERROR, data };
}

export const statusIsSuccess = (data) => {
  return { type: types.STATUS_SUCCESS, data };
}

export const statusReset = () => {
  return { type: types.STATUS_RESET };
}
