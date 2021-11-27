import { actionConstants } from "../utilities/constants";

export function isLoading(bool) {
  return {
    type: actionConstants.IS_LOADING,
    payload: bool,
  };
}

export function updateAuthentication(bool, userData) {
  console.log(userData);
  return {
    type: actionConstants.UPDATE_AUTHENTICATION,
    payload: {
      status: bool,
      user: userData,
    },
  };
}

export function loginRequest(data) {
  return {
    type: actionConstants.LOGIN_REQUEST,
    payload: data,
  };
}

export function signupRequest(data) {
  return {
    type: actionConstants.SIGNUP_REQUEST,
    payload: data,
  };
}

export function sendOTP(data) {
  console.log("Actionsss.. send OTP");
  return {
    type: actionConstants.SEND_OTP,
    payload: data,
  };
}

export function forgotPasswordChange(data) {
  return {
    type: actionConstants.FORGOT_PASSWORD_CHANGE,
    payload: data,
  };
}
