import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {View} from 'react-native';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';
import {BACKEND_API_IMAGE_URL} from '../../vars';
import {useIsFocused} from '@react-navigation/native';

const OrderShortShip = ({route, navigation}) => {
  const {orderShortShipID} = route.params;

  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [orderShortShip, setOrderShortShip] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    return () => {
      setOrderShortShip({}); // This worked for me
    };
  }, []);

  React.useEffect(() => {
    if (isFocused === true) {
      fetchOrderSHortShipData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const fetchOrderSHortShipData = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'GET',
    };
    return await fetch(
      BACKEND_API_URL + '/api/order-short-ship/id/' + orderShortShipID,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((json) => {
        setOrderShortShip(json.order_short_ship_info);
        setFetchingData(false);
      })
      .catch((err) => {
        Alert.alert(JSON.stringify(err));
      });
  };

  const handleActionAPI = async (api) => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'PUT',
    };
    return await fetch(BACKEND_API_URL + api + orderShortShipID, requestOptions)
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data) => {
        fetchOrderSHortShipData();
        Alert.alert(JSON.stringify(data.server_response));
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
  };

  const handleActionCancelAPI = async (api) => {
    const formData = new FormData();
    formData.append(
      'canceled_reason',
      'Hom nay troi mua nen khong xuong nha duoc.',
    );

    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'PUT',
      body: formData,
    };
    return await fetch(BACKEND_API_URL + api + orderShortShipID, requestOptions)
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data) => {
        fetchOrderSHortShipData();
        Alert.alert(JSON.stringify(data.server_response));
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.childContainer}>
          <View style={styles.headerAlignCenter}>
            <Text style={styles.headerText}>Select action</Text>
          </View>

          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() =>
                handleActionAPI('/api/order-short-ship/update/shipper-called/')
              }>
              <Text style={styles.panelButtonTitle}>Shipper called</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() =>
                handleActionAPI(
                  '/api/order-short-ship/update/shipper-received-money/',
                )
              }>
              <Text style={styles.panelButtonTitle}>
                Shipper received money
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() =>
                handleActionAPI('/api/order-short-ship/update/shipper-shipped/')
              }>
              <Text style={styles.panelButtonTitle}>Shipper shipped</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() =>
                navigation.navigate('Order short ship confirm', {
                  orderShortShipID: orderShortShip.id,
                })
              }>
              <Text style={styles.panelButtonTitle}>Shipper confirmed</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() =>
                handleActionCancelAPI(
                  '/api/order-short-ship/update/cancel-order/',
                )
              }>
              <Text style={styles.panelButtonTitle}>Shipper canceled</Text>
            </TouchableOpacity>
          </View>
        </View>
        {fetchingData ? (
          <></>
        ) : (
          <>
            <View style={styles.childContainer}>
              <View style={styles.headerAlignCenter}>
                <Text style={styles.headerText}>Customer information</Text>
              </View>
              <View style={styles.customerLabelContainer}>
                <Text style={styles.customerLabel}>Sender info:</Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  {orderShortShip.sender}
                </Text>
              </View>
              <View style={styles.customerLabelContainer}>
                <Text style={styles.customerLabel}>Receiver info:</Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  {orderShortShip.receiver}
                </Text>
              </View>
            </View>
            <View style={styles.childContainer2}>
              <View style={styles.headerAlignCenter}>
                <Text style={styles.headerText}>Delivery information</Text>
              </View>
              <View style={styles.customerLabelContainer}>
                <Text style={styles.customerLabel}>Order info:</Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Order ID: {orderShortShip.id}
                </Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Shipper receive money:{' '}
                  {orderShortShip.shipper_receive_money ? 'true' : 'false'}
                </Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Status:{' '}
                  {orderShortShip.canceled
                    ? 'Canceled'
                    : orderShortShip.finished
                    ? 'Finished'
                    : 'Running'}
                </Text>
              </View>
              <View style={styles.customerLabelContainer}>
                <Text style={styles.customerLabel}>Status detail:</Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Called: {orderShortShip.shipper_called ? 'true' : 'false'}
                </Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Received money:{' '}
                  {orderShortShip.shipper_received_money ? 'true' : 'false'}
                </Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Shipped: {orderShortShip.shipper_shipped ? 'true' : 'false'}
                </Text>
              </View>
              <View style={styles.customerDetailContainer}>
                <Text style={styles.customerDetail}>
                  Confirmed:{' '}
                  {orderShortShip.shipper_confirmed ? 'true' : 'false'}
                </Text>
              </View>
              {orderShortShip.shipper_confirmed !== '' ? (
                <>
                  <View style={styles.customerLabelContainer}>
                    <Text style={styles.customerLabel}>Confirm image:</Text>
                  </View>
                  <View style={styles.customerDetailContainer}>
                    <Image
                      style={styles.imageStyle}
                      source={{
                        uri:
                          BACKEND_API_IMAGE_URL +
                          orderShortShip.shipper_confirmed,
                      }}
                    />
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 57,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
    borderBottomWidth: 2,
    borderBottomColor: '#e3e3e3',
  },

  textHeader: {
    textAlign: 'center',
    margin: 'auto',
    fontSize: 25,
    fontWeight: '500',
    backgroundColor: '#fff',
  },

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
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },

  childContainer2: {
    paddingHorizontal: 20,
    paddingVertical: 5,
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
    paddingVertical: 2,
  },

  customerDetail: {
    fontSize: 14,
    color: '#000000',
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
  },

  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  imageStyle: {
    resizeMode: 'contain',
    width: '100%',
    height: 300,
  },
});

export default OrderShortShip;
