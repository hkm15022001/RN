import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, Alert} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import {format} from 'date-fns';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';

const OrderDetailLongShip = ({route, navigation}) => {
  const {longShipID} = route.params;
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  const [fetchingData, setFetchingData] = useState(true);

  let longShipParsedArray = [];
  const [data, setData] = useState([]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  React.useEffect(() => {
    fetchOrderLongShipData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => fetchOrderLongShipData(), 10000);
    return () => clearInterval(timer);
  });

  const prepareArrayData = (longShipInfo) => {
    let stateObject1 = {
      time: '',
      title: '',
      description: '',
    };
    stateObject1.time = format(
      new Date(longShipInfo.estimated_time_of_departure * 1000),
      'HH:mm',
    );
    stateObject1.title = 'Departure time';
    stateObject1.description =
      'On date: ' +
      format(
        new Date(longShipInfo.estimated_time_of_departure * 1000),
        'dd/MM',
      );
    longShipParsedArray.push(stateObject1);
    if (longShipInfo.package_loaded === true) {
      let stateObject2 = {
        time: '',
        title: '',
        description: '',
      };
      stateObject2.time = format(
        new Date(longShipInfo.loaded_time * 1000),
        'HH:mm',
      );
      stateObject2.title = 'Package Loaded';
      stateObject2.description =
        'Employee Load ID: ' +
        longShipInfo.empl_load_id.toString() +
        ' - On date: ' +
        format(new Date(longShipInfo.loaded_time * 1000), 'dd/MM');
      longShipParsedArray.push(stateObject2);
      if (longShipInfo.vehicle_started === true) {
        let stateObject3 = {
          time: '',
          title: '',
          description: '',
        };
        stateObject3.time = format(
          new Date(longShipInfo.started_time * 1000),
          'HH:mm',
        );
        stateObject3.title = 'Vehicle Started';
        stateObject3.description =
          'Employee Driver 1 ID: ' +
          longShipInfo.empl_driver_1_id.toString() +
          ' - On date: ' +
          format(new Date(longShipInfo.started_time * 1000), 'dd/MM');
        longShipParsedArray.push(stateObject3);
        if (longShipInfo.vehicle_arrived === true) {
          let stateObject4 = {
            time: '',
            title: '',
            description: '',
          };
          stateObject4.time = format(
            new Date(longShipInfo.arrived_time * 1000),
            'HH:mm',
          );
          stateObject4.title = 'Vehicle Arrived';
          stateObject4.description =
            'Employee Driver 2 ID: ' +
            longShipInfo.empl_driver_2_id.toString() +
            ' - On date: ' +
            format(new Date(longShipInfo.arrived_time * 1000), 'dd/MM');
          longShipParsedArray.push(stateObject4);
          if (longShipInfo.package_unloaded === true) {
            let stateObject5 = {
              time: '',
              title: '',
              description: '',
            };
            stateObject5.time = format(
              new Date(longShipInfo.unloaded_time * 1000),
              'HH:mm',
            );
            stateObject5.title = 'Package Unloaded';
            stateObject5.description =
              'Employee Unload ID' +
              longShipInfo.empl_unload_id.toString() +
              ' - On date: ' +
              format(new Date(longShipInfo.unloaded_time * 1000), 'dd/MM');
            longShipParsedArray.push(stateObject5);
            let stateObject6 = {
              time: '',
              title: '',
              description: '',
            };
            stateObject6.time = format(
              new Date(longShipInfo.unloaded_time * 1000),
              'HH:mm',
            );
            stateObject6.title = 'Finished';
            stateObject6.description = '';
            longShipParsedArray.push(stateObject6);
          }
        }
      }
    }
  };

  const fetchOrderLongShipData = async () => {
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'GET',
    };
    return await fetch(
      BACKEND_API_URL + '/api/long-ship/id/' + longShipID,
      requestOptions,
    )
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((json) => {
        prepareArrayData(json.long_ship_info);
        setData(longShipParsedArray);
        setFetchingData(false);
      })
      .catch((err) => {
        Alert.alert(JSON.stringify(err));
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

export default OrderDetailLongShip;

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
