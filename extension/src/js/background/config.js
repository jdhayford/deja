const apiUrlMapping = {
  'local': 'http://localhost:8080/',
  'ngrok': 'http://deja.ngrok.io/',
  'heroku': 'https://deja-api.herokuapp.com/',
};

export const getApiUrl = async () => new Promise((resolve) => {
  chrome.storage.local.get(['backendTarget'], (result) => {
    const value = result.backendTarget || 'heroku';
    resolve(apiUrlMapping[value]);
  });
});

const urlMapping = {
  'local': 'http://localhost:5000/',
  'ngrok': 'http://deja.ngrok.io/',
  'heroku': 'http://deja.video/',
};

export const getSiteUrl = async () => new Promise((resolve) => {
  chrome.storage.local.get(['backendTarget'], (result) => {
    const value = result.backendTarget || 'heroku';
    resolve(urlMapping[value]);
  });
});