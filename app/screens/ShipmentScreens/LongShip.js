/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {StyleSheet, Text, Modal, SafeAreaView, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {View} from 'react-native';

import AppStateStore from '../../store/state';
import {BACKEND_API_URL} from '../../vars';

const LongShip = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );
  const accessToken = AppStateStore.useStoreState((state) => state.accessToken);
  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  const [showMenu, setShowMenu] = useState(false);
  const [data, setData] = useState(null);

  const statusList = [
    {Title: 'Load package', API: '/api/long-ship/update-load-package/qrcode/'},
    {
      Title: 'Unload package',
      API: '/api/long-ship/update-start-vehicle/qrcode/',
    },
    {
      Title: 'Vehicle starts',
      API: '/api/long-ship/update-vehicle-arrived/qrcode/',
    },
    {
      Title: 'Vehicle arrived',
      API: '/api/long-ship/update-unload-package/qrcode/',
    },
  ];

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  const onSuccess = (e) => {
    if (e.data) {
      setShowMenu(true);
      setData(e.data);
    }
  };

  const onSetState = (API) => {
    setShowMenu(false);
    const requestOptions = {
      headers: {
        Authorization: accessToken,
      },
      method: 'PUT',
    };
    return fetch(BACKEND_API_URL + API + data, requestOptions)
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject('Bad request sent to server!');
        }
        return res.json();
      })
      .then((data2) => {
        navigation.goBack();
        Alert.alert(JSON.stringify(data2.server_response));
      })
      .catch((error) => {
        navigation.goBack();
        Alert.alert(JSON.stringify(error));
      });
  };

  return (
    <>
      <SafeAreaView>
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.off}
          showMarker={true}
          markerStyle={{borderColor: '#1BA9FF', borderRadius: 10}}
        />

        <Modal transparent={true} visible={showMenu}>
          <View
            style={{
              backgroundColor: '#000000',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                margin: 50,
                padding: 10,
                borderRadius: 10,
                flex: 1,
                width: 300,
                height: 200,
              }}>
              {statusList.map((item, i) => (
                <Text
                  style={
                    i === statusList.length - 1
                      ? styles.deliveryTimeItemLastChild
                      : styles.deliveryTimeItem
                  }
                  key={item.i + item.Title}
                  onPress={() => onSetState(item.API)}>
                  {item.Title}
                </Text>
              ))}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    color: '#777',
    height: 70,
    padding: 10,
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },

  deliveryTimeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#777',
    color: '#777',
    fontSize: 16,
    padding: 15,
    paddingBottom: 5,
  },

  deliveryTimeItemLastChild: {
    borderBottomWidth: 0,
    borderBottomColor: '#777',
    color: '#777',
    fontSize: 16,
    padding: 15,
    paddingBottom: 5,
  },

  iconColor: {
    color: '#1BA9FF',
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
});

export default LongShip;
