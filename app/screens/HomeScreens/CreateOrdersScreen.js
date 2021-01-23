import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import {useTheme} from 'react-native-paper';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ImagePicker from 'react-native-image-crop-picker';
import UserContext from '../../context/UserContext';

import AppStateStore from '../../store/state';

import {BACKEND_API_URL} from '../../vars';

const CreateOrderScreen = ({navigation}) => {
  const [contextValue, setContextValue] = useContext(UserContext);
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  const [state, setState] = useState({
    customer_send_id: 1,
    sender: '',
    receiver: '',
    transport_type_id: 1,
    detail: 'May vi tinh ca nhan',
    note: 'Giao hang vao buoi trua',
    short_ship_distance: 20,
  });

  const [senderName, setSenderName] = useState(contextValue.name);
  const [senderAddress, setSenderAddress] = useState(contextValue.address);
  const [senderPhone, setSenderPhone] = useState(contextValue.phone);

  const [receiverName, setReceiverName] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPhone, setReceiverPhone] = useState(0);

  const [image, setImage] = useState(null);
  const {colors} = useTheme();

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((_image) => {
      console.log(_image);
      setImage({
        uri: _image.path,
        width: _image.width,
        height: _image.height,
        mime: _image.mime,
      });
    });
  };

  const createOrderHandler = () => {
    let photoUploadData = {
      uri: image.path,
      type: image.mime,
      name: 'photo.jpg',
    };
    //use formdata
    let formData = new FormData();
    //append created photo{} to formdata
    formData.append('file', photoUploadData);

    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'POST',
      body: formData,
    };

    return fetch(BACKEND_API_URL + '/api/order/upload/image', requestOptions)
      .then((res) => {
        console.log(res);
        if (res.status !== 201) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.filename);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.childContainer}>
        <View style={styles.headerAlignCenter}>
          <Text style={styles.headerText}>Customer information</Text>
        </View>
        <View style={styles.customerLabelContainer}>
          <Text style={styles.customerLabel}>Your info:</Text>
        </View>
        <View style={styles.customerDetailContainer}>
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
              value={senderName}
              onChangeText={setSenderName}
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
              value={senderAddress}
              onChangeText={setSenderAddress}
            />
          </View>
          <View style={styles.action}>
            <Feather name="phone" color={colors.text} size={16} />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#666666"
              autoCorrect={false}
              keyboardType="number-pad"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              value={senderPhone.toString()}
              onChangeText={setSenderPhone}
            />
          </View>
        </View>

        <View style={styles.customerLabelContainer}>
          <Text style={styles.customerLabel}>Receiver:</Text>
        </View>
        <View style={styles.customerDetailContainer}>
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
              value={receiverName}
              onChangeText={setReceiverName}
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
              value={receiverAddress}
              onChangeText={setReceiverAddress}
            />
          </View>
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
              value={receiverPhone.toString()}
              onChangeText={setReceiverPhone}
            />
          </View>
        </View>
      </View>

      <View style={styles.childContainer}>
        <View style={styles.headerAlignCenter}>
          <Text style={styles.headerText}>Delivery information</Text>
        </View>

        <View style={styles.customerLabelContainer}>
          <Text style={styles.customerLabel}>Package info:</Text>
        </View>
        <View style={styles.customerDetailContainer}>
          <View style={styles.action}>
            <MaterialIcons name="info-outline" color={colors.text} size={16} />
            <TextInput
              placeholder="Detail"
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="pencil" color={colors.text} size={16} />
            <TextInput
              placeholder="Note"
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.customerLabelContainer}>
          <Text style={styles.customerLabel}>Image:</Text>
        </View>
        <View style={styles.customerDetailContainer}>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          {image !== null ? (
            <Image
              style={{width: 300, height: 300, resizeMode: 'contain'}}
              source={image}
            />
          ) : (
            <></>
          )}
        </View>
        <View style={styles.customerLabelContainer}>
          <Text style={styles.customerLabel}>Transport information:</Text>
        </View>
        <View style={styles.customerDetailContainer}>
          <Text style={styles.customerDetail}>Type ID: 1</Text>
          <Text style={styles.customerDetail}>Distance: 20km</Text>
        </View>
      </View>
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => createOrderHandler()}>
          <Text style={styles.panelButtonTitle}>Create An Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },

  headerAlignCenter: {
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 5,
  },

  headerText: {
    fontSize: 20,
    color: '#636363',
  },

  childContainer: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },

  customerLabelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  customerLabel: {
    fontSize: 16,
    color: '#1BA9FF',
  },

  customerLabelUpdate: {
    fontSize: 16,
    color: '#FD8209',
  },

  customerDetailContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  customerDetail: {
    fontSize: 14,
    color: '#000000',
    paddingBottom: 5,
  },

  createButtonContainer: {
    marginHorizontal: 10,
  },

  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1BA9FF',
    alignItems: 'center',
    marginVertical: 10,
  },

  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },

  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#ff9a5c',
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
    paddingLeft: 10,
  },
});
