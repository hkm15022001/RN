import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SplashScreen from '../../screens/SplashScreen';
import SignInScreen from '../../screens/SignInScreen';

import messaging from '@react-native-firebase/messaging';

function DetailsScreen() {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

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

async function saveTokenToDatabase(accessToken, appToken) {
  const requestOption = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: appToken,
    }),
  };

  return await fetch(BACKEND_API_URL + '/fcm-auth/save-token', requestOption)
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject('Unauthorized');
      }
      return res;
    })
    .catch((error) => {
      return null;
    });
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const showAlert = (title, body) => {
  Alert.alert(
    title,
    body,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
};

async function createNotificationListeners() {
  /*
   * Triggered for data only payload in foreground
   * */
  messaging().onMessage(async (remoteMessage) => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // navigation.navigate(remoteMessage.data.type);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });
}

// Define parameter for Navigation
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

export default function MainAppNavigation() {
  const reOpenApp = AppStateStore.useStoreActions(
    (actions) => actions.reOpenApp,
  );
  const isLoading = AppStateStore.useStoreState((state) => state.isLoading);
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);

  React.useEffect(() => {
    reOpenApp();
    requestUserPermission();
    createNotificationListeners();
    messaging()
      .getToken()
      .then((appToken) => {
        return saveTokenToDatabase(accessToken, appToken);
      });
    return () => {
      messaging().onTokenRefresh((appToken) => {
        saveTokenToDatabase(accessToken, appToken);
      });
      createNotificationListeners();
    };
  }, [reOpenApp, accessToken]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {accessToken == null ? (
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
  );
}
