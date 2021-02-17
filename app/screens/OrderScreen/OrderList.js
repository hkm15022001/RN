import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, FlatList, Image, Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import {format} from 'date-fns';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';
import {BACKEND_API_IMAGE_URL} from '../../vars';
import UserContext from '../../context/UserContext';

const OrderList = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  const [userContextValue] = useContext(UserContext);
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [orderList, setOrderList] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    return () => {
      setOrderList([]); // This worked for me
    };
  }, []);

  React.useEffect(() => {
    if (isFocused === true) {
      fetchOrderList();
      const timer = setInterval(() => fetchOrderList(), 60000);
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
        '/api/order/list/customer-id/' +
        userContextValue.customer_id,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((json) => {
        setOrderList(json.order_info_list);
        setFetchingData(false);
      })
      .catch((err) => {
        Alert.alert(JSON.stringify(err));
      });
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Your orders</Text>
      </View>
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
                  navigation.navigate('Order detail', {
                    orderID: item.id,
                  })
                }>
                <Card style={styles.item}>
                  <View style={styles.orderCardDetailContainer}>
                    <Image
                      source={{
                        uri: BACKEND_API_IMAGE_URL + item.image,
                      }}
                      style={styles.orderCardDetailImage}
                    />
                    <View>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.orderCardDetail}>
                        {item.detail}
                      </Text>
                      <Text style={styles.orderCardDetailText}>
                        Order id: {item.id}
                      </Text>
                      <Text style={styles.orderCardDetailText}>
                        {'Date: '}
                        {format(new Date(item.created_at * 1000), 'dd/MM/yyyy')}
                      </Text>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.orderCardDetailReceiver}>
                        Receiver: {item.receiver}
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
    width: '45%',
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

export default OrderList;
