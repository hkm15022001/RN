import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import AppStateStore from '../../store/state';

import {BACKEND_API_URL} from '../../vars';

const OrderShortShipConfirm = ({route, navigation}) => {
  const {orderShortShipID} = route.params;

  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  const [image, setImage] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then((_image) => {
        setImage({
          uri: _image.path,
          width: _image.width,
          height: _image.height,
          mime: _image.mime,
        });
      })
      .catch((err) => {
        console.log('openCamera catch' + err.toString());
      });
  };

  const submitImage = async () => {
    let photoUploadData = {
      uri: image.uri,
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
      method: 'PUT',
      body: formData,
    };
    return await fetch(
      BACKEND_API_URL +
        '/api/order-short-ship/update/shipper-confirmed/' +
        orderShortShipID,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data) => {
        navigation.goBack();
        Alert.alert(JSON.stringify(data.server_response));
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
  };

  const confirmHandler = async () => {
    if (image === null) {
      Alert.alert('Please take a picture of customer!');
    } else {
      return submitImage();
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.childContainer}>
        <View style={styles.headerAlignCenter}>
          <Text style={styles.headerText}>Delivery information</Text>
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
            <Image style={styles.imageStyle} source={image} />
          ) : (
            <></>
          )}
        </View>
      </View>

      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => confirmHandler()}>
          <Text style={styles.panelButtonTitle}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderShortShipConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e8e8',
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

  childContainer2: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },

  customerLabelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  customerLabel: {
    fontSize: 16,
    color: '#8c4d00',
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
    backgroundColor: '#977254',
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
    backgroundColor: '#cfa76e',
    alignItems: 'center',
    marginVertical: 7,
  },

  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },

  imageStyle: {
    resizeMode: 'contain',
    width: '100%',
  },
});
