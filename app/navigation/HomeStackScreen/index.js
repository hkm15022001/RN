import React from 'react';

import HomeScreen from '../../screens/HomeScreens/MainHome';

import CreateOrderScreen from '../../screens/HomeScreens/CreateOrdersScreen';
import YourOrderScreen from '../../screens/HomeScreens/YourOrdersScreen';
import YourOrderDetailScreen from '../../screens/HomeScreens/YourOrderDetailScreen';
import YourOrderDetailDeliveryStatusScreen from '../../screens/HomeScreens/YourOrderDetailDeliveryStatusScreen';
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

      <HomeStack.Screen name="Create An Order" component={CreateOrderScreen} />

      <HomeStack.Screen name="Your Orders" component={YourOrderScreen} />

      <HomeStack.Screen
        name="Your Order Detail Screen"
        component={YourOrderDetailScreen}
      />

      <HomeStack.Screen
        name="Your Order Detail Delivery Status Screen"
        component={YourOrderDetailDeliveryStatusScreen}
      />

      <HomeStack.Screen
        name="Update Location Delivery"
        component={UpdateLocationDelivery}
      />
    </HomeStack.Navigator>
  );
}
