import * as types from './actionTypes';

export function beginAjaxCall() {
  return {type: types.BEGIN_AJAX_CALL};
}

export function ajaxCallSuccess() {
  return {type: types.AJAX_CALL_SUCCESS};
}

export function ajaxCallError() {
  return {type: types.AJAX_CALL_ERROR};
}

