import { getApiUrl } from './config';
import getInstanceID from './getInstanceID';

export class SessionManager {
  constructor() {
    this.sessions = [];
  }

  clear() {
    this.sessions = [];
  }

  async addSession(url) {
    const existingSession = this.checkExistingSession(url);
    if (existingSession) return existingSession;

    const session = await this.createSession(url );
    this.sessions.push(session);
    return session;
  }

  async createSession(url) {
    const body = {
      instanceID: getInstanceID(),
      timeStamp: new Date().toJSON(),
      url,
    };
    const apiUrl = await getApiUrl();
    const response = await fetch(apiUrl + 'sessions', {
      method : "POST",
      body: JSON.stringify(body) 
    });

    return await response.json();
  }
  
  checkExistingSession(url) {
    return this.sessions.find((session) => session.url === url);
  }
 }