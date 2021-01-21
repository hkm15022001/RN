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
  const [valueforContext, setValueforContext] = React.useState({
    name: 'Bui Gia Hoa',
    address: '20 Le Truc Street, Ward 7, Binh Thanh District, Ho Chi Minh',
    phoneNumber: '0902733275',
    customerId: '123456789',
    email: 'hoa199297@gmail.com',
    gender: 'Male',
    dayofBirth: '29/7/1998',
  });
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

  const HomeStackUserContext = () => {
    return (
      <UserContext.Provider value={[valueforContext, setValueforContext]}>
        <HomeStackScreen />
      </UserContext.Provider>
    );
  };

  const OrderStackUserConstext = () => {
    return (
      <UserContext.Provider value={[valueforContext, setValueforContext]}>
        <OrderStackScreen />
      </UserContext.Provider>
    );
  };

  const ProfileStackUserContext = () => {
    return (
      <UserContext.Provider value={[valueforContext, setValueforContext]}>
        <ProfileStackScreen />
      </UserContext.Provider>
    );
  };

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
          // screenOptions={({route}) => ({
          //   tabBarIcon: ({focused, color, size}) => {
          //     let iconName;

          //     if (route.name === 'Home') {
          //       iconName = focused
          //         ? 'information-circle'
          //         : 'information-circle-outline';
          //     } else if (route.name === 'Settings') {
          //       iconName = focused ? 'list-outline' : 'list-outline';
          //     }

          //     // You can return any component that you like here!
          //     return <Ionicons name={iconName} size={size} color={color} />;
          //   },
          // })}
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
            component={HomeStackUserContext}
            options={{
              tabBarLabel: 'Home',
              tabBarColor: '#694fad',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />

          <Tab.Screen
            name="Orders"
            component={OrderStackUserConstext}
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
                <MaterialCommunityIcons name="bell" color={color} size={26} />
              ),
            }}
          />

          <Tab.Screen
            name="Profiles"
            component={ProfileStackUserContext}
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
      )}
    </NavigationContainer>
  );
}
