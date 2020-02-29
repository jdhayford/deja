import { getApiUrl } from './config';

const Resource = {
  PLAYLIST: 'playlists',
  SEGMENT: 'segments',
};

const registerStreamRequest = (request, session) => {
  const isInitiatedByExtension = request.initiator.includes('chrome-extension://');
  const resourceType = getResourceType(request.url);
  if (!isInitiatedByExtension && resourceType) {
    persistResourceRequest(resourceType, request, session);
  }
};

const persistResourceRequest = async (type, data, session) => {
  // if (type === Resource.SEGMENT) return;
  const requestData = {
    origin: data.initiator,
    referer: getRequestHeaderValue(data, 'Referer'),
    url: data.url,
    userAgent: getRequestHeaderValue(data, 'User-Agent'),
    sessionID: session.id,
  };
  const apiUrl = await getApiUrl();
  fetch(apiUrl + type, { method : "POST", body: JSON.stringify(requestData) });
};

const getResourceType = (url) => {
  let resourceType = null;
  if (url.includes('.ts')) resourceType = Resource.SEGMENT
  if (url.includes('.m3u8')) resourceType = Resource.PLAYLIST
  return resourceType;
};

const getRequestHeaderValue = (request, name) => {
  const matchingHeader = request.requestHeaders.find(header => header.name === name);
  return matchingHeader && matchingHeader.value;
};

export default registerStreamRequest;
