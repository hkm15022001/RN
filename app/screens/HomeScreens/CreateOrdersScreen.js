import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

import {useTheme} from 'react-native-paper';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ImagePicker from 'react-native-image-crop-picker';
import UserContext from '../../context/UserContext';

import AppStateStore from '../../store/state';

import {BACKEND_API_URL} from '../../vars';

const CreateOrderScreen = ({route, navigation}) => {
  const {orderVoucherID} = route.params;
  const [userContextValue, setContextValue] = useContext(UserContext);
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  const [state, setState] = useState({
    customer_send_id: userContextValue.customer_id,
    sender: '',
    receiver: '',
    transport_type_id: 1,
    detail: '',
    note: '',
    short_ship_distance: 20,
    image: '',
    order_voucher_id: orderVoucherID,
  });

  const [senderName, setSenderName] = useState(userContextValue.name);
  const [senderAddress, setSenderAddress] = useState(userContextValue.address);
  const [senderPhone, setSenderPhone] = useState(userContextValue.phone);
  const [receiverName, setReceiverName] = useState('Tuan');
  const [receiverAddress, setReceiverAddress] = useState('123 Tran Nao');
  const [receiverPhone, setReceiverPhone] = useState(234);
  const [packageDetail, setPackageDetail] = useState('May vi tinh ca nha');
  const [packageNote, setPackageNote] = useState('Giao hang vao buoi trua');

  const [orderCreatedID, setOrderCreatedID] = useState(0);
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [finishedStepOne, setFinishedStepOne] = useState(false);
  const [hideCreditButton, setHideCreditButton] = useState(false);
  const [finishedStepTwo, setFinishedStepTwo] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [image, setImage] = useState(null);
  const {colors} = useTheme();

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((_image) => {
      setImage({
        uri: _image.path,
        width: _image.width,
        height: _image.height,
        mime: _image.mime,
      });
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
      method: 'POST',
      body: formData,
    };
    return await fetch(
      BACKEND_API_URL + '/api/order/upload/image',
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 201) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then(async (data) => {
        // Keep in mind this a very dangerous way to change state of component!!!!!
        state.image = data.filename;
        setState((prevState) => {
          return {...prevState, image: data.filename};
        });
      });
  };

  const createOrderHandler = async () => {
    state.sender = senderName + ' ' + senderAddress + ' ' + senderPhone;
    state.receiver = receiverName + ' ' + receiverAddress + ' ' + receiverPhone;
    state.detail = packageDetail;
    state.note = packageNote;
    if (image === null) {
      Alert.alert('Please take a picture of your package!');
    } else if (
      senderName === '' ||
      senderAddress === '' ||
      senderPhone === 0 ||
      receiverName === '' ||
      receiverAddress === '' ||
      receiverPhone === 0 ||
      packageDetail === '' ||
      packageNote === ''
    ) {
      Alert.alert('Please fill in all blank field!');
    } else {
      return submitImage()
        .then(() => {
          const requestOptions = {
            headers: {
              Authorization: accessToken,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(state),
          };
          return fetch(
            BACKEND_API_URL + '/api/order/create-use-voucher',
            requestOptions,
          );
        })
        .then((res) => {
          if (res.status !== 201) {
            return Promise.reject('Bad request sent to server!');
          }
          return res.json();
        })
        .then((data) => {
          setOrderCreatedID(data.order_id);
          setOrderTotalPrice(data.total_price);
        })
        .catch((error) => {
          Alert.alert(JSON.stringify(error));
        });
    }
  };

  const handlePaymentStep1 = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({order_id: orderCreatedID}),
    };

    return await fetch(
      BACKEND_API_URL + '/api/order-pay/create-step-one',
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 201) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data) => {
        setFinishedStepOne(true);
        setHideCreditButton(data.hideCreditButton);
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
  };

  const handlePaymentStep2 = async (method) => {
    let ShipperReceiveMoney = false;
    if (method === 'cash') {
      ShipperReceiveMoney = true;
    }
    const requestOptions = {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        order_id: orderCreatedID,
        pay_method: method,
        shipper_receive_money: ShipperReceiveMoney,
      }),
    };

    return await fetch(
      BACKEND_API_URL + '/api/order-pay/create-step-two',
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 201) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data) => {
        setFinishedStepTwo(true);
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
  };

  const handlePaymentStep3 = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({order_id: orderCreatedID}),
    };

    return await fetch(
      BACKEND_API_URL +
        '/api/order-pay/update-payment-confirm/orderid/' +
        orderCreatedID,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then(() => {
        setPaymentConfirmed(true);
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
  };

  if (orderCreatedID === 0) {
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
              <MaterialIcons
                name="info-outline"
                color={colors.text}
                size={16}
              />
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
                value={packageDetail}
                onChangeText={setPackageDetail}
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
                value={packageNote}
                onChangeText={setPackageNote}
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
              <Image style={styles.imageStyle} source={image} />
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
            <Text style={styles.panelButtonTitle}>Create order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else if (finishedStepOne === false) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.childContainer2}>
          <View style={styles.headerAlignCenter}>
            <Text style={styles.headerText}>New order has been created!</Text>
          </View>

          <View style={styles.customerLabelContainer}>
            <Text style={styles.customerLabel}>Order info:</Text>
          </View>
          <View style={styles.customerDetailContainer}>
            <Text style={styles.customerDetail}>
              Order ID: {orderCreatedID}
            </Text>
            <Text style={styles.customerDetail}>
              Total price: {orderTotalPrice} VND
            </Text>
          </View>
          <View style={styles.customerLabelContainer}>
            <Text style={styles.customerLabel}>Order payment:</Text>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton2}
              onPress={handlePaymentStep1}>
              <Text style={styles.panelButtonTitle}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  } else if (finishedStepTwo === false) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.childContainer2}>
          <View style={styles.headerAlignCenter}>
            <Text style={styles.headerText}>
              Select method - Pay: {orderTotalPrice} VND
            </Text>
          </View>

          <View style={styles.customerLabelContainer}>
            <Text style={styles.customerLabel}>
              Shipper will receive money:
            </Text>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => handlePaymentStep2('cash')}>
              <Text style={styles.panelButtonTitle}>Use cash</Text>
            </TouchableOpacity>
          </View>
          {hideCreditButton ? (
            <></>
          ) : (
            <>
              <View style={styles.customerLabelContainer}>
                <Text style={styles.customerLabel}>Customer credit:</Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <TouchableOpacity
                  style={styles.panelButton}
                  onPress={() => handlePaymentStep2('credit')}>
                  <Text style={styles.panelButtonTitle}>Use credit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    );
  } else if (paymentConfirmed === false) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.childContainer2}>
          <View style={styles.headerAlignCenter}>
            <Text style={styles.headerText}>Please confirm your payment!</Text>
          </View>

          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton2}
              onPress={() => handlePaymentStep3()}>
              <Text style={styles.panelButtonTitle}>Payment confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.childContainer2}>
          <View style={styles.headerAlignCenter}>
            <Text style={styles.headerText}>Order payment successful!</Text>
          </View>

          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton3}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.panelButtonTitle}>Back to home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
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

  panelButton2: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#eb4034',
    alignItems: 'center',
    marginVertical: 7,
  },

  panelButton3: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#3b48ff',
    alignItems: 'center',
    marginVertical: 7,
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
  imageStyle: {
    resizeMode: 'contain',
    width: '100%',
  },
});
