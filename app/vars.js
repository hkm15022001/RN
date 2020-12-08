// Source code: https://stackoverflow.com/a/44192714

let BACKEND_API_URL, PUBLIC_KEY;
if (__DEV__ === true) {
  BACKEND_API_URL = 'http://192.168.99.8:5000';
  PUBLIC_KEY = '';
} else {
  BACKEND_API_URL = 'http://192.168.99.8:5000';
  PUBLIC_KEY = '';
}

export {BACKEND_API_URL, PUBLIC_KEY};
