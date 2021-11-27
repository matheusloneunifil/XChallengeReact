import { createStore, applyMiddleware, compose } from "redux";
import rootReducers from "./rootReducers.js";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

export default function configureStore() {
  let composeEnhancers = compose;

  const sagaMiddleware = createSagaMiddleware();
  let enhancers = [applyMiddleware(sagaMiddleware)];

  const store = createStore(rootReducers, composeEnhancers(...enhancers));

  sagaMiddleware.run(rootSaga);

  return store;
}
