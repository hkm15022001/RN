import {action, createContextStore, thunk} from 'easy-peasy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BACKEND_API_URL} from '../../vars';

const setTokenInfo = async (resJson) => {
  const access_token = ['access_token', resJson.access_token];
  const expires = ['expires', resJson.expires];
  const refresh_token = ['refresh_token', resJson.refresh_token];
  const token_type = ['token_type', resJson.token_type];
  try {
    await AsyncStorage.multiSet([
      access_token,
      expires,
      refresh_token,
      token_type,
    ]);
  } catch (e) {
    // save error
  }
};

const validateAccessToken = async () => {
  let values = [];
  try {
    values = await AsyncStorage.multiGet([
      'access_token',
      'expires',
      'refresh_token',
      'token_type',
    ]);
  } catch (e) {
    // read error
  }
  let token = values[3][1] + values[0][1];
  let time = Math.floor(Date.now() / 1000);
  if (time > values[1][1]) {
    fetch(BACKEND_API_URL + '/app-auth/access-token/get-new', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: values[2][1],
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.status !== 201) {
          return Promise.reject('Unauthorized');
        }
        return res.json();
      })
      .then((json) => {
        setTokenInfo(json);
        token = json.token_type + json.access_token;
        return token;
      })
      .catch((error) => {
        AsyncStorage.clear();
        return null;
      });
  } else {
    return token;
  }
};

const bootstrapAsync = async () => {
  let values = [];
  // await AsyncStorage.clear();
  try {
    values = await AsyncStorage.multiGet([
      'access_token',
      'expires',
      'refresh_token',
      'token_type',
    ]);
  } catch (e) {
    // read error
  }
  if (
    values[0][1] === null ||
    values[1][1] === null ||
    values[2][1] === null ||
    values[3][1] === null
  ) {
    await AsyncStorage.clear();
    return null;
  } else {
    let token = values[3][1] + values[0][1];
    let time = Math.floor(Date.now() / 1000);
    if (time > values[1][1]) {
      fetch(BACKEND_API_URL + '/app-auth/access-token/get-new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: values[2][1],
        }),
      })
        .then((res) => {
          if (res.status !== 201) {
            return Promise.reject('Unauthorized');
          }
          return res.json();
        })
        .then((json) => {
          setTokenInfo(json);
          token = json.token_type + json.access_token;
          return token;
        })
        .catch((error) => {
          AsyncStorage.clear();
          return null;
        });
    } else if (time < values[1][1]) {
      fetch(BACKEND_API_URL + '/app-auth/access-token/check-old', {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            return Promise.reject('Unauthorized');
          }
          return res.json();
        })
        .then((json) => {
          setTokenInfo(json);
          token = json.token_type + json.access_token;
          return token;
        })
        .catch((error) => {
          AsyncStorage.clear();
          return null;
        });
    }
  }
};

const storeConfig = {
  name: 'MyStateStore',
};

const AppStateStore = createContextStore(
  {
    isLoading: true,
    isSignout: false,
    accessToken: null,
    setAccessToken: action((state, accessToken) => {
      state.isLoading = false;
      state.accessToken = accessToken;
    }),
    signOut: action((state) => {
      state.isLoading = false;
      state.isSignout = true;
      state.accessToken = null;
    }),
    signIn: action((state, accessToken) => {
      state.isLoading = false;
      state.isSignout = false;
      state.accessToken = accessToken;
    }),
    validateToken: thunk(async (actions) => {
      await validateAccessToken().then((token) => {
        if (token == null) {
          actions.signOut();
        } else {
          actions.setAccessToken(token);
        }
      });
    }),
    reOpenApp: thunk(async (actions) => {
      await bootstrapAsync().then((token) => {
        if (token == null) {
          actions.signOut();
        } else {
          actions.setAccessToken(token);
        }
      });
    }),
  },
  storeConfig,
);

export default AppStateStore;
