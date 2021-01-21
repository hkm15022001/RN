import React, {useContext} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserContext from '../../context/UserContext';

const MainProfilesScreen = ({navigation}) => {
  const [valueforContext, setValueforContext] = useContext(UserContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image
            source={{
              uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
            }}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}>
              John Doe
            </Title>
            <Caption style={styles.caption}>@j_doe</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="account" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20, marginRight: 10}}>
            {valueforContext.name}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20, marginRight: 10}}>
            {valueforContext.phoneNumber}
          </Text>
          <Icon
            name="lead-pencil"
            color="#1BA9FF"
            size={16}
            onPress={() => navigation.navigate('Edit Profile')}
          />
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{color: '#777777', marginLeft: 20, marginRight: 10}}>
            {valueforContext.email}
          </Text>
          <Icon
            name="lead-pencil"
            color="#1BA9FF"
            size={16}
            onPress={() => navigation.navigate('Edit Profile')}
          />
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
        <View
          style={[
            styles.infoBox,
            {
              borderRightColor: '#dddddd',
              borderRightWidth: 1,
            },
          ]}>
          <Title>1</Title>
          <Caption>On Delivery Orders</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>12</Title>
          <Caption>Total Orders</Caption>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple
          onPress={() => {
            navigation.navigate('Introduce');
          }}>
          <View style={styles.menuItem}>
            <Icon name="information" color="#1BA9FF" size={25} />
            <Text style={styles.menuItemText}>Introduce</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={() => {
            navigation.navigate('How to use');
          }}>
          <View style={styles.menuItem}>
            <Icon name="book-open-page-variant" color="#1BA9FF" size={25} />
            <Text style={styles.menuItemText}>How to use</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple
          onPress={() => {
            navigation.navigate('Settings');
          }}>
          <View style={styles.menuItem}>
            <Icon name="cog-outline" color="#1BA9FF" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});

export default MainProfilesScreen;
