import ServiceWorkerListener from './ServiceWorkerListener';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('sw.js')
        .catch((registrationError) => console.log(registrationError));
    });
  }
}

export function initateServiceWorkerListener(store) {
  if ('serviceWorker' in navigator) {
    new ServiceWorkerListener(store, navigator.serviceWorker).startListening();
  }
}
