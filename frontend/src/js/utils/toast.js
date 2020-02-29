const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again.';

export const errorToast = (message = DEFAULT_ERROR_MESSAGE) =>
  iziToast.error({
    title: 'Error',
    position: 'bottomCenter',
    message,
  });
