import React from 'react';

import OrderList from '../../screens/OrderScreen/OrderList';
import OrderDetail from '../../screens/OrderScreen/OrderDetail';
import OrderDetailLongShip from '../../screens/OrderScreen/OrderDetailLongShip';
import OrderDetailShortShip from '../../screens/OrderScreen/OrderDetailShortShip';

import {createStackNavigator} from '@react-navigation/stack';
const OrderStack = createStackNavigator();

export default function OrderStackScreen() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen
        options={{headerShown: false}}
        name="Order list"
        component={OrderList}
      />
      <OrderStack.Screen name="Order detail" component={OrderDetail} />

      <OrderStack.Screen
        name="Order detail long ship"
        component={OrderDetailLongShip}
      />

      <OrderStack.Screen
        name="Order detail short ship"
        component={OrderDetailShortShip}
      />
    </OrderStack.Navigator>
  );
}
