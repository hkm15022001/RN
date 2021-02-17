import React from 'react';

import MainShipment from '../../screens/ShipmentScreens/MainShipment';
import LongShip from '../../screens/ShipmentScreens/LongShip';
import OrderShortShipList from '../../screens/ShipmentScreens/OrderShortShipList';
import OrderShortShip from '../../screens/ShipmentScreens/OrderShortShip';
import OrderShortShipConfirm from '../../screens/ShipmentScreens/OrderShortShipConfirm';

import {createStackNavigator} from '@react-navigation/stack';
const ShipmentStackStack = createStackNavigator();

export default function ShipmentStackScreen() {
  return (
    <ShipmentStackStack.Navigator>
      <ShipmentStackStack.Screen
        options={{headerShown: false}}
        name="Home"
        component={MainShipment}
      />
      <ShipmentStackStack.Screen name="LongShip" component={LongShip} />
      <ShipmentStackStack.Screen
        name="Order short ship list"
        component={OrderShortShipList}
      />
      <ShipmentStackStack.Screen
        name="Order short ship"
        component={OrderShortShip}
      />
      <ShipmentStackStack.Screen
        name="Order short ship confirm"
        component={OrderShortShipConfirm}
      />
    </ShipmentStackStack.Navigator>
  );
}
