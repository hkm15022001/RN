import React from 'react';
import {View, Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AuthContext, {AuthProvider} from '../AuthContext';
import {BACKEND_API_URL} from '../../vars';
import SplashScreen from '../../screens/SplashScreen';
import SignInScreen from '../../screens/SignInScreen';

function DetailsScreen() {
  const {validateAccessToken} = React.useContext(AuthContext);
  React.useEffect(() => {
    validateAccessToken();
  });
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function SettingsScreen({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

// Define parameter for Navigation
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

export default function MainAppNavigation() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            access_token: action.access_token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            access_token: action.token,
            isLoading: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            access_token: null,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      access_token: null,
    },
  );

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

  React.useEffect(() => {
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
        dispatch({type: 'SIGN_OUT'});
      } else {
        let token = values[3][1] + values[0][1];
        let time = Math.floor(Date.now() / 1000);
        if (time > values[1][1]) {
          fetch(BACKEND_API_URL + '/user-auth/app/access-token/get-new', {
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
              dispatch({
                type: 'RESTORE_TOKEN',
                access_token: json.token_type + json.access_token,
              });
            })
            .catch((error) => {
              dispatch({type: 'SIGN_OUT'});
            });
        } else if (time < values[1][1]) {
          fetch(BACKEND_API_URL + '/user-auth/app/access-token/check-old', {
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
              dispatch({
                type: 'RESTORE_TOKEN',
                access_token: json.token_type + json.access_token,
              });
            })
            .catch((error) => {
              dispatch({type: 'SIGN_OUT'});
            });
        } else {
          dispatch({type: 'SIGN_OUT'});
        }
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      validateAccessToken: async () => {
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
        console.log(token);
        if (time > values[1][1]) {
          fetch(BACKEND_API_URL + '/user-auth/app/access-token/get-new', {
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
              dispatch({type: 'SIGN_IN', token: json.access_token});
              token = json.token_type + json.access_token;
            })
            .catch((error) => {
              dispatch({type: 'SIGN_OUT'});
            });
        }
        return token;
      },
      signIn: async (resJson) => {
        setTokenInfo(resJson);
        dispatch({type: 'SIGN_IN', token: resJson.access_token});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider value={authContext}>
      <NavigationContainer>
        {state.access_token == null ? (
          <AuthStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
          </AuthStack.Navigator>
        ) : (
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused
                    ? 'information-circle'
                    : 'information-circle-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'list-outline' : 'list-outline';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'blue',
              inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </AuthProvider>
  );
}
