import React, {useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import {format} from 'date-fns';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';

const OrderDetailShortShip = ({route, navigation}) => {
  const {orderShortShipID} = route.params;
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [fetchingData, setFetchingData] = useState(true);

  let orderShortShipParsedArray = [];
  const [data, setData] = useState([]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchOrderShortShipData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => fetchOrderShortShipData(), 10000);
    return () => clearInterval(timer);
  });

  const prepareArrayData = (orderShortShipInfo) => {
    let stateObject1 = {
      time: '',
      title: '',
      description: '',
    };
    stateObject1.time = 'Start';
    stateObject1.title = 'Select shipper';
    stateObject1.description =
      'Shipper ID: ' + orderShortShipInfo.shipper_id.toString();
    orderShortShipParsedArray.push(stateObject1);

    if (orderShortShipInfo.shipper_called === true) {
      let stateObject2 = {
        time: '',
        title: '',
        description: '',
      };
      stateObject2.time = 'Next';
      stateObject2.title = 'Shipper called';
      stateObject2.description = '';
      orderShortShipParsedArray.push(stateObject2);
    }

    if (orderShortShipInfo.shipper_receive_money === true) {
      if (orderShortShipInfo.shipper_received_money === true) {
        let stateObject3 = {
          time: '',
          title: '',
          description: '',
        };
        stateObject3.time = format(
          new Date(orderShortShipInfo.received_money_time * 1000),
          'HH:mm',
        );
        stateObject3.title = 'Shipper received money';
        stateObject3.description =
          'On date: ' +
          format(
            new Date(orderShortShipInfo.received_money_time * 1000),
            'dd/MM',
          );
        orderShortShipParsedArray.push(stateObject3);
      }
    }

    if (orderShortShipInfo.shipper_shipped === true) {
      let stateObject4 = {
        time: '',
        title: '',
        description: '',
      };
      stateObject4.time = format(
        new Date(orderShortShipInfo.shipped_time * 1000),
        'HH:mm',
      );
      stateObject4.title = 'Shipper Shipped';
      stateObject4.description =
        'On date: ' +
        format(new Date(orderShortShipInfo.shipped_time * 1000), 'dd/MM');
      orderShortShipParsedArray.push(stateObject4);
      if (orderShortShipInfo.shipper_confirmed !== '') {
        let stateObject5 = {
          time: '',
          title: '',
          description: '',
        };
        stateObject5.time = format(
          new Date(orderShortShipInfo.shipper_confirmed_time * 1000),
          'HH:mm',
        );
        stateObject5.title = 'Shipper Confirmed';
        stateObject5.description =
          'On date: ' +
          format(
            new Date(orderShortShipInfo.shipper_confirmed_time * 1000),
            'dd/MM',
          );
        orderShortShipParsedArray.push(stateObject5);
        let stateObject6 = {
          time: '',
          title: '',
          description: '',
        };
        stateObject6.time = format(
          new Date(orderShortShipInfo.shipper_confirmed_time * 1000),
          'HH:mm',
        );
        stateObject6.title = 'Finished';
        stateObject6.description = '';
        orderShortShipParsedArray.push(stateObject6);
      }
    }
  };

  const fetchOrderShortShipData = async () => {
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
        prepareArrayData(json.order_short_ship_info);
        setData(orderShortShipParsedArray);
        setFetchingData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {fetchingData ? (
        <></>
      ) : (
        <>
          <Timeline
            style={styles.list}
            data={data}
            circleSize={35}
            dotSize={18}
            circleColor="rgb(90, 43, 16)"
            lineColor="rgb(90, 43, 16)"
            timeContainerStyle={styles.timeContainerStyle}
            timeStyle={styles.timeStyle}
            descriptionStyle={styles.descriptionStyle}
            options={{
              style: {paddingTop: 5},
            }}
            detailContainerStyle={styles.detailContainerStyle}
            innerCircle={'dot'}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderDetailShortShip;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: 'white',
  },

  list: {
    flex: 1,
    marginTop: 10,
  },

  headerAlignCenter: {
    height: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  headerText: {
    fontSize: 20,
    color: '#4a4a4a',
  },

  descriptionStyle: {color: 'black'},

  timeStyle: {
    textAlign: 'center',
    backgroundColor: '#a65e0a',
    color: 'white',
    padding: 5,
    borderRadius: 13,
  },

  timeContainerStyle: {minWidth: 52, marginTop: 1},

  detailContainerStyle: {
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 5,
    backgroundColor: '#cca189',
    borderRadius: 10,
  },
});
