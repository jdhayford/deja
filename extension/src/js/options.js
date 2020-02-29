import '../css/options.css';

populateSelection();
document.getElementById('deja_form').addEventListener('submit', saveBackend);

function saveBackend(event) {
  event.preventDefault();

  const formData = new FormData(event.target)
  const backendValue = formData.get('backend');
  chrome.storage.local.set({ backendTarget: backendValue }, () => {
    console.info('Value is set to ' + backendValue);
  });
}

function populateSelection() {
  chrome.storage.local.get(['backendTarget'], (result) => {
    const value = result.backendTarget || 'heroku';
    document.getElementById('deja_form')[value].checked = true;
  });
}