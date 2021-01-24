import React, {useState} from 'react';
import {Avatar, Chip, Card, Button, Paragraph, FAB} from 'react-native-paper';
import {StyleSheet, View, Text, FlatList, Animated} from 'react-native';
import {format} from 'date-fns';
import AppStateStore from '../../store/state';

const LeftContent = (props) => <Avatar.Icon {...props} icon="check" />;

import {BACKEND_API_URL} from '../../vars';

const HomeScreen = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchVoucherData('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Source: https://github.com/mukeshphulwani66/Youtube-clone-React-Native/blob/master/src/screens/Home.js
  // Youtube: https://www.youtube.com/watch?v=mvxgWuxwnik
  // Hide header when scroll up
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 101); // 96 is the height of header
  const translateY = diffClamp.interpolate({
    inputRange: [0, 101],
    outputRange: [0, -101],
  });

  const [dataVoucher, setDataVoucher] = useState([]);
  const [sortCondition, setsortCondition] = useState('');

  function parseArray(item, index, arr) {
    let nowUnix = new Date().getTime();
    // Store new end_date to reuse
    let newEndDate = item.end_date;
    if (item.start_date * 1000 < nowUnix && item.end_date * 1000 > nowUnix) {
      arr[index].end_date = true;
    } else {
      arr[index].end_date = false;
    }

    arr[index].start_date =
      'Start:' +
      format(new Date(item.start_date * 1000), 'dd/MM/yyyy') +
      ' - ' +
      'End:' +
      format(new Date(newEndDate * 1000), 'dd/MM/yyyy');
  }

  const fetchVoucherData = async (queryString) => {
    let fullQueryString = '';
    if (queryString === 'comming') {
      setsortCondition('comming');
      fullQueryString = '?sortByCondition=' + queryString;
    } else if (queryString === 'happening') {
      setsortCondition('happening');
      fullQueryString = '?sortByCondition=' + queryString;
    } else {
      setsortCondition('');
    }
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'GET',
    };
    return await fetch(
      BACKEND_API_URL + '/api/order-voucher/list' + fullQueryString,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((json) => {
        let arrayJson = json.order_voucher_list;
        arrayJson.forEach(parseArray);
        setDataVoucher(arrayJson);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          transform: [{translateY: translateY}],
          elevation: 4,
          zIndex: 100,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}>
        <View style={styles.headerContainer}>
          <Text style={styles.textHeader}>What's new ?</Text>

          <View style={styles.rowFlexContainer}>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => fetchVoucherData('')}
              selected={sortCondition === ''}>
              All
            </Chip>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => fetchVoucherData('comming')}
              selected={sortCondition === 'comming'}>
              Comming soon
            </Chip>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => fetchVoucherData('happening')}
              selected={sortCondition === 'happening'}>
              Happening
            </Chip>
          </View>
        </View>
      </Animated.View>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        numColumns={1}
        keyExtractor={(item) => item.id.toString()}
        data={dataVoucher}
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        renderItem={({item}) => (
          <View style={styles.flatListItem}>
            <Card>
              <Card.Title
                title={item.title}
                subtitle={item.start_date}
                left={LeftContent}
              />
              <Card.Content>
                <Paragraph>{item.content}</Paragraph>
              </Card.Content>
              <Card.Cover
                source={require('../../assets/picture/voucher.jpg')}
              />
              <Card.Actions style={styles.cardAction}>
                <Button
                  onPress={() =>
                    navigation.navigate('Create order', {
                      orderVoucherID: item.id,
                    })
                  }
                  disabled={!item.end_date}>
                  {item.end_date ? 'Select' : 'Not happening!'}
                </Button>
              </Card.Actions>
            </Card>
          </View>
        )}
      />
      <View style={styles.fabContainer}>
        <FAB
          style={styles.fab}
          small
          label="Create order"
          icon="plus"
          onPress={() =>
            navigation.navigate('Create order', {
              orderVoucherID: 0,
            })
          }
          color="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e8e8',
  },

  headerContainer: {
    height: 101,
    backgroundColor: '#fff',
  },

  fabContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    marginBottom: 10,
  },
  fab: {
    position: 'relative',
    backgroundColor: '#c29c6d',
    left: '-50%',
  },

  rowFlexContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 0,
    backgroundColor: '#fff',
  },

  rowFlexItem: {
    marginRight: 10,
  },

  flatListContainer: {
    paddingTop: 110, //96+5
    paddingBottom: 55,
  },

  flatListItem: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  textHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 25,
    backgroundColor: '#fff',
    textAlign: 'center',
  },

  cardAction: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default HomeScreen;
