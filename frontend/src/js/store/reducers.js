import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { SET_SESSION, SET_SESSION_STATUS, SET_REPLAYS_BY_SESSION_CODE } from './actions';
import { Status } from '../services/fetchSessionStatus';

export const session = (state = null, action) => {
  switch (action.type) {
    case SET_SESSION: {
      return action.session;
    }
    default:
      return state;
  }
};

export const sessionStatus = (state = Status.WAITING, action) => {
  switch (action.type) {
    case SET_SESSION_STATUS: {
      return action.sessionStatus;
    }
    default:
      return state;
  }
};

export const replaysBySessionCode = (state = {}, action) => {
  switch (action.type) {
    case SET_REPLAYS_BY_SESSION_CODE: {
      return {
        ...state,
        [action.sessionCode]: action.replays,
      };
    }
    default:
      return state;
  }
};

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    session,
    sessionStatus,
    replaysBySessionCode,
  });
