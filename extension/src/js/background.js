import { registerStreamRequest } from './background/index';
import { SessionManager } from './background/sessionManager';

const sessionManager = new SessionManager();
const tabSessions = {};

const handleRequest = (request) => {
  const tabSession = tabSessions[request.tabId];
  // Saw situation where origin http://stream-cr7.net but initiator http://yosports.net
  // const fromActiveSession = sessionManager.sessions.some(s => s.origin === request.initiator);
  const isStreamResource = request.url.includes('.m3u8') || request.url.includes('.ts');
  const validMethod = request.method !== 'OPTIONS';
  if (isStreamResource && validMethod) {
    registerStreamRequest(request, tabSession);
  }
};

const resetRequestListeners = () => {
  chrome.webRequest.onSendHeaders.removeListener(handleRequest);

  Object.keys(tabSessions).forEach((tabId) => {
    chrome.webRequest.onSendHeaders.addListener(handleRequest, {
      tabId: parseInt(tabId),
      urls: [],
      types: ['xmlhttprequest'] ,
    }, ['requestHeaders', 'extraHeaders']);
  })
};

chrome.extension.onConnect.addListener((port) => {
  port.onMessage.addListener(async (tab) => {
    const session = await sessionManager.addSession(tab.url);

    tabSessions[tab.id] = session;
    resetRequestListeners();
    port.postMessage(session);
  });
});

chrome.storage.onChanged.addListener(function(changes) {
  for (let key in changes) {
    if (key == 'backendTarget') {
      sessionManager.clear();
    }
  }
});