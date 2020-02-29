import config from '../utils/config';
import moment from 'moment';
import { setSessionStatus } from '../store';

export const Status = {
  WAITING: 'WAITING',
  HEALTHY: 'HEALTHY',
  FAILING: 'FAILING',
  OFFLINE: 'OFFLINE',
};

const computeStatus = (status) => {
  const { lastPlaylistAt, lastFailureAt } = status;

  if (!lastPlaylistAt && !lastFailureAt) {
    return Status.WAITING;
  }

  const threshold = moment().subtract(1, 'minutes');
  const isStale = [lastPlaylistAt, lastFailureAt].every((time) => !time || moment(time).isBefore(threshold));
  
  if (isStale) return Status.OFFLINE;

  if (!lastFailureAt) {
    return Status.HEALTHY;
  } else if (!lastPlaylistAt) {
    return Status.FAILING;
  }

  return moment(lastPlaylistAt).isAfter(lastFailureAt) ? Status.HEALTHY : Status.FAILING;
}

const seconds = (numSeconds) => 1000*numSeconds;
const heartbeat = (status, callback) => {
  const timeout = {
    [Status.WAITING]: seconds(5),
    [Status.HEALTHY]: seconds(5),
    [Status.FAILING]: seconds(10),
  }[status];

  if (timeout) setTimeout(callback, timeout);
}

export const fetchSessionStatus = async (dispatch, code) => {
  try {
    const url =`${config.API_BASE_URL}/sessions/${code}/status`;
    const response = await fetch(url);
    const rawStatus = await response.json();
    const status = computeStatus(rawStatus);
    dispatch(setSessionStatus(status));

    heartbeat(status, () => fetchSessionStatus(dispatch, code));
    return status;
  } catch (e) {
    console.error(e)
    throw new Error("Session not found.")
  }
};
