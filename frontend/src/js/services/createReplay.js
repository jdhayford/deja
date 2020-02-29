import config from '../utils/config';

export const createReplay = async (sessionCode) => {
  try {
    const url = `${config.API_BASE_URL}/sessions/${sessionCode}/replays?seconds=60`;
    const response = await fetch(url, { method : "POST" });
    return await response.json();
  } catch (e) {
    throw new Error('Failed to create replay')
  }
};
