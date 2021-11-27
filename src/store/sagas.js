import { call, put, takeEvery, takeLatest, all } from "redux-saga/effects";
import { actionConstants } from "../utilities/constants";
import { isLoading, updateAuthentication } from "./action";

function* loginRequest(action) {
  yield takeLatest(actionConstants.LOGIN_REQUEST, authenticateUser);
}

function* signupRequest(action) {
  yield takeLatest(actionConstants.SIGNUP_REQUEST, registerUser);
}

function* sendOTP(action) {
  console.log("saga.. send OTP take latest");
  yield takeLatest(actionConstants.SEND_OTP, triggerOTP);
}

function* forgotPassChange(action) {
  yield takeLatest(
    actionConstants.FORGOT_PASSWORD_CHANGE,
    forgotPasswordChange
  );
}

function* authenticateUser(action) {
  try {
    // invoca a API
    const data = yield call(() => {}, { response: action.payload });
    // Invoca a ação de sucesso
    yield put(isLoading(false));
    yield put(updateAuthentication(true, action.payload));
  } catch (e) {
    // Invoca a ação de erro com dados
    //yield put(fetchPostsError(e));
  }
}

function* registerUser(action) {
  try {
    // invoca a API
    const data = yield call(
      setTimeout(() => {}, 5000),
      { response: action.payload }
    );
    // Invoca a ação de sucesso
    yield put(isLoading(false));
    console.log("Inside Saga");
    console.log(action.payload);
    //yield put(updateAuthentication(true, action.payload));
  } catch (e) {
    // Invoca a ação de erro com dados
    //yield put(fetchPostsError(e));
  }
}

function* forgotPasswordChange(action) {
  try {
    // invoca a API
    const data = yield call(() => {}, { response: action.payload });
    // Invoca a ação de sucesso
    yield put(isLoading(false));
    console.log("Inside Saga");
    console.log(action.payload);
    //yield put(updateAuthentication(true, action.payload));
  } catch (e) {
    // Invoca a ação de erro com dados
    //yield put(fetchPostsError(e));
  }
}

function* triggerOTP(action) {
  try {
    console.log("saga.. sent otp");
    // invoca a API
    const data = yield call(() => {}, { response: action.payload });
    // Invoca a ação de sucesso
    yield put(isLoading(false));
    console.log("OTP SENT");
    console.log(action.payload);
    //yield put(updateAuthentication(true, action.payload));
  } catch (e) {
    // Invoca a ação de erro com dados
    //yield put(fetchPostsError(e));
  }
}

export default function* rootSaga() {
  yield all([loginRequest(), signupRequest(), sendOTP(), forgotPassChange()]);
}
