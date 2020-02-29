export const SET_SESSION = 'SET_SESSION';
export const SET_SESSION_STATUS = 'SET_SESSION_STATUS';
export const SET_REPLAYS_BY_SESSION_CODE = 'SET_REPLAYS_BY_SESSION_CODE';

export const setSession = (session) => ({ type: SET_SESSION, session });
export const setSessionStatus = (sessionStatus) => ({ type: SET_SESSION_STATUS, sessionStatus });
export const setReplaysBySessionCode = (sessionCode, replays) => ({
  type: SET_REPLAYS_BY_SESSION_CODE,
  sessionCode,
  replays
});
