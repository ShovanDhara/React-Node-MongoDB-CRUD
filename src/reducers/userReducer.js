import * as types from "../actions/actionTypes";
const initialState = {
  loginData: [],
  isLoggedIn: false,
  ajaxCallsInProgress: 0,
  isAdmin: false,
  favoriteTeam: ''
};
const user = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_USER_SUCCESS:
      return {
        ...state,
        isAdmin: action.user.isAdmin ? action.user.isAdmin : false
      };
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        loginData: action.user,
        isAdmin: action.user.isAdmin ? action.user.isAdmin : false,
        favoriteTeam: action.user.favoriteTeam
      };
    case types.SET_CURRENT_USER:
      return {
        ...state,
        isLoggedIn: true,
        loginData: action.user,
        favoriteTeam: action.user.favoriteTeam,
        isAdmin: action.user.isAdmin ? action.user.isAdmin : false
      };
    case types.SET_FAVORITE_SUCCESS:
      return {
        ...state,
        favoriteTeam: action.data
      };
    case types.LOGIN_USER_ERROR:
      return { ...state, isLoggedIn: false, loginData: [] };
    case types.LOG_OUT_SUCCESS:
      return { ...state, isLoggedIn: false, isAdmin: false, loginData: [], favoriteTeam: '' };
    default:
      return state;
  }
};

export default user;
