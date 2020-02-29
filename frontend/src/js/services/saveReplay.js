import config from '../utils/config';

export const saveReplay = async (replay) => {
  replay.saved = true;

  try {
    const url = `${config.API_BASE_URL}/replays/${replay.id}`;
    const response = await fetch(url, {
      method : "POST",
      body: JSON.stringify(replay) 
    });
    return await response.json();
  } catch (e) {
    throw new Error('Failed to save replay')
  }
};
