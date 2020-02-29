import { getApiUrl } from "../background/config";

export const newReplay = async (code) =>  {
  const apiUrl = await getApiUrl();
  const url = `${apiUrl}sessions/${code}/replays?seconds=30`;
  const response = await fetch(url, { method: 'POST' });
  return await response.json();
};