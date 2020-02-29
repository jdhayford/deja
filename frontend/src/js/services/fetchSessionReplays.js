import config from '../utils/config';
import { setReplaysBySessionCode } from '../store';

export const fetchSessionReplays = async (dispatch, sessionCode) => {
  try {
    const url = `${config.API_BASE_URL}/sessions/${sessionCode}/replays`;
    const response = await fetch(url);
    const replays = await response.json();
    dispatch(setReplaysBySessionCode(sessionCode, replays));
  } catch (e) {
    throw new Error("Session replays not found.")
  }
};
