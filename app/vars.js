// Source code: https://stackoverflow.com/a/44192714

let BACKEND_API_URL, PUBLIC_KEY, BACKEND_API_IMAGE_URL;
if (__DEV__ === true) {
  BACKEND_API_URL = 'http://192.168.99.8:5001';
  BACKEND_API_IMAGE_URL = 'http://192.168.1.105:5001/api/images/';
  PUBLIC_KEY = '';
} else {
  BACKEND_API_URL = 'http://192.168.1.107:5001';
  BACKEND_API_IMAGE_URL = 'http://192.168.99.8:5001/api/images/';
  PUBLIC_KEY = '';
}

export {BACKEND_API_URL, PUBLIC_KEY, BACKEND_API_IMAGE_URL};
