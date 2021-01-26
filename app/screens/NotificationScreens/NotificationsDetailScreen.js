import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NotificationsDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Notification Detail Screen.</Text>
    </View>
  );
};

export default NotificationsDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
