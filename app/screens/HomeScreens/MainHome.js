import React from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./Transportation.jpg')}
        style={{width: 400, height: 200}}
      />
      <View style={styles.header}>
        <MaterialCommunityIcons name="qrcode-scan" color="#FFFFFF" size={24} />
        <MaterialCommunityIcons name="magnify" color="#FFFFFF" size={24} />
      </View>

      <View style={styles.container_featureList}>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            color="#1BA9FF"
            size={45}
            onPress={() => navigation.navigate('Create An Order')}
          />
          <Text style={styles.text}>Create order</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            color="#1BA9FF"
            size={45}
            onPress={() => navigation.navigate('Your Orders')}
          />
          <Text style={styles.text}>Your orders</Text>
        </View>

        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="face-agent" color="#1BA9FF" size={45} />
          <Text style={styles.text}>CS</Text>
        </View>
      </View>

      <View style={{paddingLeft: 10}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 5}}>
          News
        </Text>
        <View style={{marginTop: 10}}>
          <Image
            source={require('./Transportation.jpg')}
            style={{width: 160, height: 80}}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#777777',
              width: 160,
            }}>
            adfadfasdfasfdasdfasfdasdfasdf
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '95%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems:'center',
  },

  container_featureList: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#DCDCDC',
  },
  featureItem: {
    width: 75,
    height: 100,
    margin: 0,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:"red",
  },

  text: {
    fontSize: 12,
    marginTop: 5,
    alignItems: 'center',
    color: '#777777',
  },
});

export default HomeScreen;
