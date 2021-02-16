import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';
import {View} from 'react-native';
import AppStateStore from '../../store/state';

const MainShipment = ({navigation}) => {
  const validateToken = AppStateStore.useStoreActions(
    (actions) => actions.validateToken,
  );

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Shipment</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.childContainer2}>
          <View style={styles.headerAlignCenter}>
            <Text style={styles.headerText}>Select shipment type</Text>
          </View>

          <View style={styles.customerLabelContainer}>
            <Text style={styles.customerLabel}>Update long ship</Text>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => navigation.navigate('LongShip')}>
              <Text style={styles.panelButtonTitle}>QR scan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customerLabelContainer}>
            <Text style={styles.customerLabel}>Update short ship:</Text>
          </View>
          <View style={styles.customerDetailContainer}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => navigation.navigate('Order short ship list')}>
              <Text style={styles.panelButtonTitle}>Order short ship list</Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default MainShipment;
