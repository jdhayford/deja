export const getCurrentTab = () => new Promise((resolve) => {
  chrome.windows.getCurrent((w) => {
    chrome.tabs.getSelected(w.id, (response) => {
      resolve(response);
    });
  });
});
  