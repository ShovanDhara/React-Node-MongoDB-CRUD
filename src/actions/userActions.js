import * as types from "./actionTypes";
import UserApi from "../api/userApi";
import { beginAjaxCall, ajaxCallError, ajaxCallSuccess } from "./ajaxCallStatusAction";
import { statusIsError, statusIsSuccess } from "./statusAction";
import setAuthToken from "../api/setAuthToken";
import jwt_decode from "jwt-decode";

export function registerUserSuccess(user) {
  return { type: types.CREATE_USER_SUCCESS, user };
}
export function setFavoriteSuccess(data) {
  return { type: types.SET_FAVORITE_SUCCESS, data };
}
export function loginUserSuccess(user) {
  return { type: types.LOGIN_USER_SUCCESS, user };
}

export function loginUserError(error) {
  return { type: types.LOGIN_USER_ERROR };
}

export function logOutSuccess() {
  return { type: types.LOG_OUT_SUCCESS };
}

export const logoutUser = () => {
  return dispatch => {
    dispatch(logOutSuccess());
    dispatch(statusIsSuccess("Logged out successfully"));
    sessionStorage.removeItem("token");
    setAuthToken(false);
  };
};

export const setCurrentUser = (decoded) => {
  return {
    type: types.SET_CURRENT_USER,
    user: decoded
  };
};

export const registerUser = user => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return UserApi.createUser(user)
      .then(user => {
        if (user.data) {
          dispatch(registerUserSuccess(user.data));
          dispatch(statusIsSuccess("User created successfully"));
        }
      })
      .catch(error => {
        dispatch(ajaxCallError());
        dispatch(statusIsError(error));
      });
  };
};

export const setFavorite = (favotiteTeam) => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return UserApi.setFavorite(favotiteTeam)
      .then(user => {
        if (user.data) {
          const { token } = user.data;
          sessionStorage.setItem("token", token);
          // Set token to Auth header
          setAuthToken(token);
          dispatch(ajaxCallSuccess());
          dispatch(setFavoriteSuccess(user.data.favoriteTeam));
          dispatch(statusIsSuccess("Favorite updated"));
        }
      })
      .catch(error => {
        dispatch(ajaxCallError());
        dispatch(statusIsError(error));
      });
  };
};

export const updateUserPermission = (data) => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return UserApi.updateUserPermission(data)
      .then(user => {
        if (user.data) {
          dispatch(ajaxCallSuccess());
          dispatch(statusIsSuccess("User data updated successfully"));
          return user.data;
        }
      })
      .catch(error => {
        dispatch(ajaxCallError());
        dispatch(statusIsError(error));
      });
  };
};

export const loginUser = user => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return UserApi.loginUser(user)
      .then(user => {
        if (user.data) {
          // Set token to localStorage
          const { token } = user.data;
          sessionStorage.setItem("token", token);
          // Set token to Auth header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          dispatch(loginUserSuccess(decoded));
          // dispatch(statusIsSuccess("Logged in successfully"));
        }
      })
      .catch(error => {
        dispatch(loginUserError(error));
        dispatch(statusIsError(error));
        dispatch(ajaxCallError());
      });
  };
};

export const loadUser = () => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return UserApi.loadUser()
      .then(user => {
        dispatch(ajaxCallSuccess());
        return user.data;
      })
      .catch(error => {
        dispatch(statusIsError(error));
        dispatch(ajaxCallError());
      });
  };
};

export const deleteUser = (userid) => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return UserApi.deleteUserById(userid).then(user => {
      if (user.data) {
        dispatch(ajaxCallSuccess());
        dispatch(statusIsSuccess("User deleted successfully"));
        return user.data;
      }
    }).catch(error => {
      dispatch(statusIsError(error));
      dispatch(ajaxCallError());
    });
  };
};


