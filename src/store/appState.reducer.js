import { actionConstants } from "../utilities/constants";

const defaultState = {
  isLoading: false,
  isAuthenticated: false,
  userData: {},
};

const appStateReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionConstants.IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case actionConstants.UPDATE_AUTHENTICATION:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload.status,
        userData: action.payload.user,
      };

    default:
      return state;
  }
};

export default appStateReducer;
