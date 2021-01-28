import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import {Card} from 'react-native-shadow-cards';
import {format} from 'date-fns';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';
import UserContext from '../../context/UserContext';

const MainNotifications = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  const [userContextValue] = useContext(UserContext);
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [customerNotifiationList, setCustomerNotifiationList] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchNotificationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const isFocused = navigation.isFocused();
    if (isFocused === true) {
      const timer = setInterval(() => fetchNotificationList(), 10000);
      return () => clearInterval(timer);
    }
  });

  const fetchNotificationList = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'GET',
    };
    return await fetch(
      BACKEND_API_URL +
        '/api/customer-notification/list/customer-id/' +
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
        setCustomerNotifiationList(json.customer_notification_list);
        console.log(123);
        setFetchingData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Notification</Text>
      </View>
      {fetchingData ? (
        <></>
      ) : (
        <>
          <FlatList
            style={styles.taskList}
            numColumns={1}
            keyExtractor={(item) => item.id.toString()}
            data={customerNotifiationList}
            renderItem={({item}) => (
              <View style={styles.taskItemContainer}>
                <Card style={styles.taskItem}>
                  <View style={styles.taskItemHeader}>
                    <View style={styles.IconWrapAccountContent}>
                      <IconFeather name="gift" color="#FFF" size={20} />
                    </View>
                    <View style={styles.taskItemHeaderTitle}>
                      <Text style={styles.taskItemHeaderTitleText}>
                        {item.title}
                      </Text>
                      <Text style={styles.taskItemDate}>
                        {format(new Date(item.created_at * 1000), 'dd/MM/yyyy')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.taskItemContent}>{item.content}</Text>
                </Card>
              </View>
            )}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  taskList: {
    paddingTop: 5,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
  },

  taskItemContainer: {
    // justifyContent:'space-between',
    // alignItems:'flex-start',
    // paddingTop: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#777777',
    paddingBottom: 5,
    width: '100%',
    alignItems: 'center',
  },

  taskItem: {
    width: '95%',
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    borderRadius: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: '#777777',
    shadowOffset: {width: 1, height: 1},
  },

  taskItemHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  taskItemHeaderTitle: {paddingLeft: 10},

  taskItemHeaderTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1BA9FF',
  },

  taskItemDate: {fontSize: 11, color: '#777'},

  taskItemContent: {fontSize: 16, color: '#777'},

  IconWrapAccountContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
    minHeight: 30,
    borderRadius: 60,
    backgroundColor: '#F5A623',
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

export default MainNotifications;
