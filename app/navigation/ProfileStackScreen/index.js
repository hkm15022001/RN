import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../../screens/ProfileScreens/MainProfiles';
import EditProfileScreen from '../../screens/ProfileScreens/EditProfileScreens';
import IntroduceScreen from '../../screens/ProfileScreens/IntroduceScreen';
import HowToUseScreen from '../../screens/ProfileScreens/HowToUseScreen';
import SettingsScreen from '../../screens/ProfileScreens/SettingsScreen';

const ProfileStack = createStackNavigator();

export default function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileScreen}
      />

      <ProfileStack.Screen name="Edit Profile" component={EditProfileScreen} />

      <ProfileStack.Screen name="Introduce" component={IntroduceScreen} />

      <ProfileStack.Screen name="How to use" component={HowToUseScreen} />

      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}
