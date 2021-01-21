import React from 'react';

import CreateOrderScreen from '../../screens/OrderScreen/CreateOrdersScreen';
import YourOrderScreen from '../../screens/OrderScreen/YourOrdersScreen';
import YourOrderDetailScreen from '../../screens/OrderScreen/YourOrderDetailScreen';
import YourOrderDetailDeliveryStatusScreen from '../../screens/OrderScreen/YourOrderDetailDeliveryStatusScreen';
import UpdateLocationDelivery from '../../screens/OrderScreen/UpdateLocationDelivery';

import {createStackNavigator} from '@react-navigation/stack';
const OrderStack = createStackNavigator();

export default function OrderStackScreen() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen
        options={{headerShown: false}}
        name="Your Orders"
        component={YourOrderScreen}
      />
      <OrderStack.Screen name="Create An Order" component={CreateOrderScreen} />

      <OrderStack.Screen
        name="Your Order Detail Screen"
        component={YourOrderDetailScreen}
      />

      <OrderStack.Screen
        name="Your Order Detail Delivery Status Screen"
        component={YourOrderDetailDeliveryStatusScreen}
      />

      <OrderStack.Screen
        name="Update Location Delivery"
        component={UpdateLocationDelivery}
      />
    </OrderStack.Navigator>
  );
}
