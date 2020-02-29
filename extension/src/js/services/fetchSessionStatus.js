import moment from 'moment';
import { getApiUrl } from "../background/config";

export const SessionStatus = {
  READY: 'READY',
  INITIAL: 'INITIAL',
  WAITING: 'WAITING',
  HEALTHY: 'HEALTHY',
  FAILING: 'FAILING',
  OFFLINE: 'OFFLINE',
};

const computeStatus = (status) => {
  const { lastPlaylistAt, lastFailureAt } = status;

  if (!lastPlaylistAt && !lastFailureAt) {
    return SessionStatus.WAITING;
  }

  const threshold = moment().subtract(1, 'minutes');
  const isStale = [lastPlaylistAt, lastFailureAt].every((time) => !time || moment(time).isBefore(threshold));
  
  if (isStale) return SessionStatus.OFFLINE;

  if (!lastFailureAt) {
    return SessionStatus.HEALTHY;
  } else if (!lastPlaylistAt) {
    return SessionStatus.FAILING;
  }

  return moment(lastPlaylistAt).isAfter(lastFailureAt) ? SessionStatus.HEALTHY : SessionStatus.FAILING;
}

export const fetchSessionStatus = async (code) => {
  try {
    const apiUrl = await getApiUrl();
    const url =`${apiUrl}sessions/${code}/status`;
    const response = await fetch(url);
    const rawStatus = await response.json();
    return computeStatus(rawStatus);
  } catch (e) {
    console.error(e)
    throw new Error("Session not found.")
  }
};
