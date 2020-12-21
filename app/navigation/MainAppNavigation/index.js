import React from 'react';
import {View, Text, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStateStore from '../../store/state';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SplashScreen from '../../screens/SplashScreen';
import SignInScreen from '../../screens/SignInScreen';

import messaging from '@react-native-firebase/messaging';

function DetailsScreen() {
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

// async function saveTokenToDatabase(token) {
//   // Assume user is already signed in
//   const userId = auth().currentUser.uid;

//   // Add the token to the users datastore
//   await firestore()
//     .collection('users')
//     .doc(userId)
//     .update({
//       tokens: firestore.FieldValue.arrayUnion(token),
//     });
// }

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
    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     return saveTokenToDatabase(token);
    //   });
    // return messaging().onTokenRefresh((token) => {
    //   saveTokenToDatabase(token);
    // });
  }, [reOpenApp]);

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
