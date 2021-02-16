import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';

const OrderDetail = ({route, navigation}) => {
  const {orderID} = route.params;
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [orderInfo, setorderInfo] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderData = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'GET',
    };
    return await fetch(
      BACKEND_API_URL + '/api/order/id/' + orderID,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((json) => {
        setorderInfo(json.order_info);
        console.log(json.order_info);
        setFetchingData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <ScrollView style={styles.container}>
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
              <Text style={styles.customerDetail}>{orderInfo.sender}</Text>
            </View>
            <View style={styles.customerLabelContainer}>
              <Text style={styles.customerLabel}>Receiver info:</Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>{orderInfo.receiver}</Text>
            </View>
          </View>

          <View style={styles.childContainer}>
            <View style={styles.headerAlignCenter}>
              <Text style={styles.headerText}>Delivery information</Text>
            </View>
            <View style={styles.customerLabelContainer}>
              <Text style={styles.customerLabel}>Order info:</Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>
                Order ID: {orderInfo.id}
              </Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>
                Order short ship ID: {orderInfo.order_short_ship_id || 0}
              </Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>
                Long ship ID: {orderInfo.long_ship_id || 0}
              </Text>
            </View>
            <View style={styles.customerLabelContainer}>
              <Text style={styles.customerLabel}>Package info:</Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>
                Detail: {orderInfo.detail}
              </Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>Note: {orderInfo.note}</Text>
            </View>
            <View style={styles.customerLabelContainer}>
              <Text style={styles.customerLabel}>Transport info:</Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>
                Type ID: {orderInfo.transport_type_id}
              </Text>
            </View>
            <View style={styles.customerDetailContainer}>
              <Text style={styles.customerDetail}>
                Distance: {orderInfo.short_ship_distance}
              </Text>
            </View>
          </View>

          <View style={styles.childContainer}>
            <View style={styles.headerAlignCenter}>
              <Text style={styles.headerText}>Delivery status</Text>
            </View>
            {orderInfo.long_ship_id !== 0 ? (
              <>
                <View style={styles.customerLabelContainer}>
                  <Text style={styles.customerLabel}>Long ship status:</Text>
                </View>
                <View style={styles.customerDetailContainer}>
                  <TouchableOpacity
                    style={styles.panelButton}
                    onPress={() =>
                      navigation.navigate('Order detail long ship', {
                        longShipID: orderInfo.long_ship_id,
                      })
                    }>
                    <Text style={styles.panelButtonTitle}>View detail</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <></>
            )}
            {orderInfo.order_short_ship_id !== 0 ? (
              <>
                <View style={styles.customerLabelContainer}>
                  <Text style={styles.customerLabel}>Short ship status:</Text>
                </View>
                <View style={styles.customerDetailContainer}>
                  <TouchableOpacity
                    style={styles.panelButton}
                    onPress={() =>
                      navigation.navigate('Order detail short ship', {
                        orderShortShipID: orderInfo.order_short_ship_id,
                      })
                    }>
                    <Text style={styles.panelButtonTitle}>View detail</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
              style={styles.commandButton}
              onPress={() => fetchOrderData()}>
              <Text style={styles.panelButtonTitle}>Refresh detail</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default OrderDetail;

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
    paddingVertical: 5,
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
    paddingVertical: 2,
  },

  customerDetail: {
    fontSize: 14,
    color: '#000000',
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
