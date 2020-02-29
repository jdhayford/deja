import config from '../utils/config';
import { setSession } from '../store';

export const fetchSession = async (dispatch, code) => {
  try {
    const url =`${config.API_BASE_URL}/sessions/${code}`;
    const response = await fetch(url);
    const session = await response.json();
    dispatch(setSession(session));
    return session;
  } catch (e) {
    throw new Error("Session not found.")
  }
};
