/* eslint-disable no-underscore-dangle */

import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import reducer from './reducers';

export const history = createBrowserHistory();

// Redux devtools setup as per https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export function createReduxStore(preloadedState) {
  const store = createStore(
    reducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(routerMiddleware(history))),
  );
  return store;
}
