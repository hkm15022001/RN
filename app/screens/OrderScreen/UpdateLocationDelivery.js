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
  const [image, setImage] = useState(
    'https://api.adorable.io/avatars/80/abott@adorable.png',
  );
  const {colors} = useTheme();

  const [deliveryTimeData, setDeliveryTimeData] = useState([
    {id: 1, description: 'Morning (7h30 -12h00)'},
    {id: 2, description: 'Evening (13h30 -18h00)'},
    {id: 3, description: 'Afternoon (18h30 -21h00)'},
    {id: 4, description: 'On weekdays'},
    {id: 5, description: 'At weekends'},
  ]);

  const [serviceData, setServiceData] = useState([
    {
      id: 1,
      title: 'Express Delivery',
      timeDelivery: '2-4 days',
      price: '100.000 VND',
    },
    {
      id: 2,
      title: 'Money-saving Delivery',
      timeDelivery: '7-9 days',
      price: '40.000 VND',
    },
    {
      id: 3,
      title: 'Normal Delivery',
      timeDelivery: '3-5 days',
      price: '6000 VND',
    },
  ]);

  const takePhotoFromCamera = () => {};

  const choosePhotoFromLibrary = () => {};

  // renderInner = () => (
  //   <View style={styles.panel}>
  //     <View style={{alignItems: 'center'}}>
  //       <Text style={styles.panelTitle}>Upload Photo</Text>
  //       <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
  //     </View>
  //     <TouchableOpacity
  //       style={styles.panelButton}
  //       onPress={takePhotoFromCamera}>
  //       <Text style={styles.panelButtonTitle}>Take Photo</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={styles.panelButton}
  //       onPress={choosePhotoFromLibrary}>
  //       <Text style={styles.panelButtonTitle}>Choose From Library</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={styles.panelButton}
  //       onPress={() => this.bs.current.snapTo(1)}>
  //       <Text style={styles.panelButtonTitle}>Cancel</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  // renderHeader = () => (
  //   <View style={styles.header}>
  //     <View style={styles.panelHeader}>
  //       <View style={styles.panelHandle} />
  //     </View>
  //   </View>
  // );

  // bs = React.createRef();
  const [valueforContext, setValueforContext] = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });
  return (
    <ScrollView style={styles.container}>
      <View style={{paddingLeft: 10, backgroundColor: '#ffff', paddingTop: 25}}>
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
            defaultValue={valueforContext.phoneNumber}
            onChangeText={(text) => {
              setUserInfo({phoneNumber: text});
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
      <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
        <Text style={styles.panelButtonTitle}>Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdateLocationDelivery;

const styles = StyleSheet.create({
  deliveryTimeList: {},

  deliveryTimeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#777',
    color: '#777',
    fontSize: 16,
    padding: 15,
  },

  deliveryTimeItemLastChild: {
    borderBottomWidth: 0,
    borderBottomColor: '#777',
    color: '#777',
    fontSize: 16,
    padding: 15,
  },

  textAreaInput: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    color: '#666666',
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlignVertical: 'top',
  },

  container: {
    flex: 1,
  },

  noteButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1BA9FF',
    marginTop: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
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
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomColor: '#f2f2f2',
    borderTopColor: '#f2f2f2',
    borderRightColor: '#f2f2f2',
    borderLeftColor: '#f2f2f2',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
    paddingLeft: 5,
    borderRadius: 10,
    height: 50,
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
