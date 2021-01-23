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

const setUserRoleInfo = async (_employeeID, _customerID) => {
  const employeeID = ['employee_id', _employeeID.toString()];
  const customerID = ['customer_id', _customerID.toString()];
  try {
    await AsyncStorage.multiSet([employeeID, customerID]);
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
    return await fetch(BACKEND_API_URL + '/app-auth/access-token/get-new', {
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
        return Promise.resolve(token);
      })
      .catch((error) => {
        AsyncStorage.clear();
        return null;
      });
  } else {
    return Promise.resolve('StillValid');
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
    AsyncStorage.clear();
    return null;
  } else {
    let token = values[3][1] + values[0][1];
    let time = Math.floor(Date.now() / 1000);
    if (time > values[1][1]) {
      return await fetch(BACKEND_API_URL + '/app-auth/access-token/get-new', {
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
          return Promise.resolve(token);
        })
        .catch((error) => {
          AsyncStorage.clear();
          return null;
        });
    } else if (time < values[1][1]) {
      return await fetch(BACKEND_API_URL + '/app-auth/access-token/check-old', {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            return Promise.reject('Unauthorized');
          }
          return Promise.resolve(token);
        })
        .catch((error) => {
          AsyncStorage.clear();
          return null;
        });
    }
  }
};

const bootstrapUserRole = async () => {
  let values = [];
  // await AsyncStorage.clear();
  try {
    values = await AsyncStorage.multiGet(['employee_id', 'customer_id']);
  } catch (e) {
    // read error
  }
  if (values[0][1] === null || values[1][1] === null) {
    AsyncStorage.clear();
    return Promise.resolve(null);
  } else {
    let obj = {
      employeeID: values[0][1],
      customerID: values[1][1],
    };
    return Promise.resolve(obj);
  }
};

const userContextDefault = {
  customer_id: 0,
  employee_id: 0,
  name: '',
  address: '',
  phone: 0,
  gender: '',
  age: 0,
};

const bootstrapUserContext = async (accessToken, userSpecificID) => {
  let apiString = '';
  if (userSpecificID.employeeID !== '0') {
    apiString =
      BACKEND_API_URL + '/api/employee/id/' + userSpecificID.employeeID;
  } else {
    apiString =
      BACKEND_API_URL + '/api/customer/id/' + userSpecificID.customerID;
  }
  return await fetch(apiString, {
    headers: {
      Authorization: accessToken,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject('Unauthorized');
      }
      return res.json();
    })
    .then((json) => {
      let renewUserContext = userContextDefault;
      if (userSpecificID.employeeID !== '0') {
        renewUserContext.employee_id = json.employee_info.id;
        renewUserContext.customer_id = 0;
        renewUserContext.name = json.employee_info.name;
        renewUserContext.address = json.employee_info.address;
        renewUserContext.phone = json.employee_info.phone;
        renewUserContext.gender = json.employee_info.gender;
        renewUserContext.age = json.employee_info.age;
      } else {
        renewUserContext.customer_id = json.customer_info.id;
        renewUserContext.employee_id = 0;
        renewUserContext.name = json.customer_info.name;
        renewUserContext.address = json.customer_info.address;
        renewUserContext.phone = json.customer_info.phone;
        renewUserContext.gender = json.customer_info.gender;
        renewUserContext.age = json.customer_info.age;
      }
      return Promise.resolve(renewUserContext);
    })
    .catch((error) => {
      AsyncStorage.clear();
      return null;
    });
};

const storeConfig = {
  name: 'MyStateStore',
};

const AppStateStore = createContextStore(
  {
    userContextInStore: userContextDefault,
    isEmployee: false,
    isCustomer: false,
    isLoading: true,
    isSignout: false,
    accessToken: null,
    setUserContext: action((state, front_end_context) => {
      state.userContextInStore = front_end_context;
      setUserRoleInfo(
        front_end_context.employee_id,
        front_end_context.customer_id,
      );
      state.isEmployee = front_end_context.employee_id !== 0 ? true : false;
      state.isCustomer = front_end_context.customer_id !== 0 ? true : false;
    }),
    setAccessToken: action((state, accessToken) => {
      state.isLoading = false;
      state.accessToken = accessToken;
    }),
    setUserRole: action((state, userSpecificID) => {
      state.employeeID = userSpecificID.employeeID;
      state.customerID = userSpecificID.customerID;
      if (userSpecificID.employeeID !== '0') {
        state.isEmployee = true;
      } else {
        state.isCustomer = true;
      }
    }),
    signOut: action((state) => {
      state.isLoading = false;
      state.isSignout = true;
      state.accessToken = null;
    }),
    signIn: action((state, json) => {
      setTokenInfo(json.tokens);
      state.isLoading = false;
      state.isSignout = false;
      state.accessToken = json.tokens.token_type + json.tokens.access_token;
    }),
    validateToken: thunk(async (actions) => {
      let token = await validateAccessToken();
      if (typeof token === 'undefined') {
        actions.signOut();
      } else if (token !== 'StillValid') {
        actions.setAccessToken(token);
      }
    }),
    reOpenApp: thunk(async (actions) => {
      let token = await bootstrapAsync();
      if (token === null) {
        actions.signOut();
      } else {
        let userSpecificID = await bootstrapUserRole();
        if (userSpecificID === null) {
          actions.signOut();
        } else {
          actions.setUserRole(userSpecificID);
          let renewUserContext = await bootstrapUserContext(
            token,
            userSpecificID,
          );
          if (renewUserContext === null) {
            actions.signOut();
          } else {
            actions.setUserContext(renewUserContext);
            actions.setAccessToken(token);
          }
        }
      }
    }),
  },
  storeConfig,
);

export default AppStateStore;
