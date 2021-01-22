import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.viewStyles}>
      <Text style={styles.textStyles}>Move Nice!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  textStyles: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
