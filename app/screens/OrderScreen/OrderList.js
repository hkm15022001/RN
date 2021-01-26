import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, FlatList, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import {format} from 'date-fns';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';
import UserContext from '../../context/UserContext';

const OrderList = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  const [userContextValue] = useContext(UserContext);
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [orderList, setOrderList] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchNotificationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotificationList = async () => {
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
        console.log(json.order_info_list);
        setFetchingData(false);
      })
      .catch((err) => {
        console.log(err);
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
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={{color: '#000000', fontSize: 14}}>
                      Order id: {item.id}
                    </Text>
                    <View style={{paddingRight: 5}}>
                      <View
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <Text style={{color: '#666666', fontSize: 11}}>
                          Created date:{' '}
                          {format(
                            new Date(item.created_at * 1000),
                            'dd/MM/yyyy',
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      paddingRight: 10,
                    }}>
                    <Image
                      source={require('./Transportation.jpg')}
                      style={{width: 80, height: 80, borderRadius: 10}}
                    />
                    <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          paddingBottom: 10,
                        }}>
                        {item.detail}
                      </Text>
                      <Text style={{fontSize: 14, color: '#666666'}}>
                        {item.receiver}
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
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignItems: 'center',
  },

  item: {
    width: '95%',
    padding: 5,
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: '#777777',
    overflow: 'hidden',
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
});

export default OrderList;
