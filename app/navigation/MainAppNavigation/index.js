import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import UserContext from '../../context/UserContext';
import HomeStackScreen from '../HomeStackScreen';
import OrderStackScreen from '../OrderStackScreen';
import ProfileStackScreen from '../ProfileStackScreen';
import NotificationScreen from '../../screens/NotificationScreens/MainNotificatons';

import SplashScreen from '../../screens/SplashScreen';
import SignInScreen from '../../screens/SignInScreen';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

////////////////////////////////////////////////// Template to verify //////////////////////////////////////////////////

//   const validateToken = AppStateStore.useStoreActions(
//     (actions) => actions.validateToken,
//   );
//   React.useEffect(() => {
//     validateToken();
//   }, [validateToken]);

////////////////////////////////////////////////// Template to verify //////////////////////////////////////////////////

/////////////////////////////// Firebase cloud messaging config ///////////////////////////////

async function saveTokenToDatabase(accessToken, appToken) {
  const requestOption = {
    method: 'POST',
    headers: {
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
    console.log('Authorization device status:', authStatus);
  }
}

async function createNotificationListeners() {
  /*
   * Triggered for data only payload in foreground
   * */
  messaging().onMessage(async (remoteMessage) => {
    console.log(remoteMessage);
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));

    PushNotification.localNotification({
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
      channelId: remoteMessage.data.channelId,
    });
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

/////////////////////////////// Firebase cloud messaging config ///////////////////////////////

// Define parameter for Navigation
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

export default function MainAppNavigation() {
  const reOpenApp = AppStateStore.useStoreActions(
    (actions) => actions.reOpenApp,
  );
  const isLoading = AppStateStore.useStoreState((state) => state.isLoading);
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const isCustomer = AppStateStore.useStoreState((state) => state.isCustomer);
  const userContextInStore = AppStateStore.useStoreState(
    (state) => state.userContextInStore,
  );
  const [valueforContext, setValueforContext] = React.useState({
    customer_id: 0,
    employee_id: 0,
    name: '',
    address: '',
    phone: 0,
    gender: '',
    age: 0,
  });

  React.useEffect(() => {
    reOpenApp();
    requestUserPermission();
    createNotificationListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setValueforContext(userContextInStore);
  }, [userContextInStore]);

  React.useEffect(() => {
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
  }, [accessToken]);

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
        <UserContext.Provider value={[valueforContext, setValueforContext]}>
          {isCustomer === true ? (
            <Tab.Navigator
              tabBarOptions={{
                showLabel: false,
                activeTintColor: '#c98249',
                inactiveTintColor: 'gray',
                tabStyle: {
                  paddingVertical: 5,
                },
              }}>
              <Tab.Screen
                name="Home"
                component={HomeStackScreen}
                options={{
                  tabBarLabel: 'Home',
                  tabBarColor: '#694fad',
                  tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={26}
                    />
                  ),
                }}
              />

              <Tab.Screen
                name="Orders"
                component={OrderStackScreen}
                options={{
                  tabBarLabel: 'Orders',
                  tabBarColor: '#694fad',
                  tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons
                      name="package-variant-closed"
                      color={color}
                      size={26}
                    />
                  ),
                }}
              />

              <Tab.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                  tabBarLabel: 'Notifications',
                  tabBarColor: '#694fad',
                  tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons
                      name="bell"
                      color={color}
                      size={26}
                    />
                  ),
                }}
              />

              <Tab.Screen
                name="Profiles"
                component={ProfileStackScreen}
                options={{
                  tabBarLabel: 'Profiles',
                  tabBarColor: '#694fad',
                  // tabBarVisible: false, sử dụng biến truyền component con sang cha để gán giá trị
                  tabBarIcon: ({color}) => (
                    <EvilIcons name="navicon" color={color} size={26} />
                  ),
                }}
              />
            </Tab.Navigator>
          ) : (
            <></>
          )}
        </UserContext.Provider>
      )}
    </NavigationContainer>
  );
}
