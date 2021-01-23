import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {useTheme} from 'react-native-paper';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import UserContext from '../../context/UserContext';

const UpdateLocationDelivery = ({navigation}) => {
  const {colors} = useTheme();

  const [valueforContext, setValueforContext] = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  return (
    <ScrollView style={styles.container}>
      <View style={styles.childContainer}>
        <View style={styles.action}>
          <Feather name="phone" color={colors.text} size={16} />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            defaultValue={valueforContext.phone}
            onChangeText={(text) => {
              setUserInfo({phone: text});
            }}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={16} />
          <TextInput
            placeholder="Your full name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            defaultValue={valueforContext.name}
            onChangeText={(text) => {
              setUserInfo({name: text});
            }}
          />
        </View>
        <View style={styles.action}>
          <Feather name="map-pin" color={colors.text} size={16} />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            defaultValue={valueforContext.address}
            onChangeText={(text) => {
              setUserInfo({address: text});
            }}
          />
        </View>
      </View>
      <View style={styles.createButtonContainer}>
        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Create An Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UpdateLocationDelivery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },

  childContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },

  createButtonContainer: {
    marginHorizontal: 10,
  },

  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1BA9FF',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  action: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomColor: '#d9d9d9',
    borderTopColor: '#d9d9d9',
    borderRightColor: '#d9d9d9',
    borderLeftColor: '#d9d9d9',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 10,
    borderRadius: 10,
    height: 42,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    color: '#05375a',
  },
});
