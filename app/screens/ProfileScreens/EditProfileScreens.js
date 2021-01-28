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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import UserContext from '../../context/UserContext';

const EditProfileScreen = () => {
  const {colors} = useTheme();

  const [valueforContext] = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    customer_id: 0,
    name: '',
    address: '',
    phone: 0,
    gender: '',
    age: 0,
  });

  React.useEffect(() => {
    setUserInfo(valueforContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.IconContainer}>
          <View style={styles.IconWrap}>
            <Icon name="account" size={60} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
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
            defaultValue={userInfo.name}
            onChangeText={(text) => {
              setUserInfo({name: text});
            }}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="address-card" color={colors.text} size={20} />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            defaultValue={userInfo.address}
            onChangeText={(text) => {
              setUserInfo({address: text});
            }}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color={colors.text} size={20} />
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
            defaultValue={userInfo.phone.toString()}
            onChangeText={(text) => {
              setUserInfo({phone: text});
            }}
          />
        </View>
        <View style={styles.action}>
          <Icon name="gender-male" color={colors.text} size={20} />
          <TextInput
            placeholder="Gender"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            defaultValue={userInfo.gender}
            onChangeText={(text) => {
              setUserInfo({gender: text});
            }}
          />
        </View>
        <View style={styles.action}>
          <Icon name="cake-layered" color={colors.text} size={20} />
          <TextInput
            placeholder="Day of birth"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            defaultValue={userInfo.age.toString()}
            onChangeText={(text) => {
              setUserInfo({age: text});
            }}
          />
        </View>
        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },

  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1BA9FF',
    alignItems: 'center',
    marginTop: 10,
  },

  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },

  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },

  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

  textInput: {
    flex: 1,
    color: '#05375a',
  },

  IconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },

  IconWrap: {
    backgroundColor: '#1BA9FF',
    maxWidth: 100,
    maxHeight: 100,
    borderRadius: 60,
  },
});
