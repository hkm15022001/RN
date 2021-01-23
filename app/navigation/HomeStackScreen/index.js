import React from 'react';

import HomeScreen from '../../screens/HomeScreens/MainHome';
import CreateOrderScreen from '../../screens/HomeScreens/CreateOrdersScreen';
import UpdateLocationDelivery from '../../screens/HomeScreens/UpdateLocationDelivery';

import {createStackNavigator} from '@react-navigation/stack';
const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <HomeStack.Screen name="Create order" component={CreateOrderScreen} />
      <HomeStack.Screen
        name="Update Location Delivery"
        component={UpdateLocationDelivery}
      />
    </HomeStack.Navigator>
  );
}
