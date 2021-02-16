import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, FlatList, Image} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import {format} from 'date-fns';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';
import UserContext from '../../context/UserContext';

const OrderShortShipList = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  const [userContextValue] = useContext(UserContext);
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [orderList, setOrderList] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const isFocused = useIsFocused();
  const imageSource = require('./Transportation.jpg');

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchOrderList();
    return () => {
      setOrderList([]); // This worked for me
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isFocused === true) {
      const timer = setInterval(() => fetchOrderList(), 30000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const fetchOrderList = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'GET',
    };
    return await fetch(
      BACKEND_API_URL +
        '/api/order-short-ship/list/employee-id/' +
        userContextValue.employee_id,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((json) => {
        setOrderList(json.order_short_ship_list);
        console.log(json.order_short_ship_list);
        setFetchingData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {fetchingData ? (
        <></>
      ) : (
        <>
          <FlatList
            style={styles.taskList}
            numColumns={1}
            keyExtractor={(item) => item.id.toString()}
            data={orderList}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.container}
                onPress={() =>
                  navigation.navigate('Order short ship', {
                    orderShortShipID: item.id,
                  })
                }>
                <Card style={styles.item}>
                  <View style={styles.orderCardDetailContainer}>
                    <Image
                      source={imageSource}
                      style={styles.orderCardDetailImage}
                    />
                    <View>
                      <Text style={styles.orderCardDetail}>
                        Order ID {item.order_id} {'- '}
                        {format(
                          new Date(item.created_at * 1000),
                          'HH:mm dd/MM/yy',
                        )}
                      </Text>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.orderCardDetailReceiver}>
                        Sender: {item.sender}
                      </Text>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.orderCardDetailReceiver}>
                        Receiver: {item.receiver}
                      </Text>
                      <Text style={styles.orderCardDetailReceiver}>
                        Status:{' '}
                        {item.canceled
                          ? 'Canceled'
                          : item.finished
                          ? 'Finished'
                          : 'Running'}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    alignItems: 'center',
    paddingTop: 5,
  },

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

  taskList: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  item: {
    width: '95%',
    marginHorizontal: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },

  orderCardDetailContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 10,
  },

  orderCardDetailImage: {
    width: 85,
    height: 85,
    borderRadius: 10,
    marginRight: 10,
  },

  orderCardDetail: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  orderCardDetailText: {fontSize: 14, color: '#000'},

  orderCardDetailReceiver: {
    width: '45%',
    fontSize: 14,
    color: '#000',
  },
});

export default OrderShortShipList;
