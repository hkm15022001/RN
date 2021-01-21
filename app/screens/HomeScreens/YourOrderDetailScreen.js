import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';

import {useTheme} from 'react-native-paper';

import Timeline from 'react-native-timeline-flatlist';
import {LogBox} from 'react-native';

const YourOrderDetailScreen = ({navigation}) => {
  const [image, setImage] = useState(
    'https://api.adorable.io/avatars/80/abott@adorable.png',
  );
  const {colors} = useTheme();

  const [deliveryTimeData, setDeliveryTimeData] = useState([
    {id: 1, description: 'Morning (7h30 -12h00)'},
    {id: 2, description: 'Evening (13h30 -18h00)'},
    {id: 3, description: 'Afternoon (18h30 -21h00)'},
    {id: 4, description: 'On weekdays'},
    {id: 5, description: 'At weekends'},
  ]);

  const [serviceData, setServiceData] = useState([
    {
      id: 1,
      title: 'Express Delivery',
      timeDelivery: '2-4 days',
      price: '100.000 VND',
    },
    {
      id: 2,
      title: 'Money-saving Delivery',
      timeDelivery: '7-9 days',
      price: '40.000 VND',
    },
    {
      id: 3,
      title: 'Normal Delivery',
      timeDelivery: '3-5 days',
      price: '6000 VND',
    },
  ]);

  const [dataa, setData] = useState([
    {title: 'Delivered successfully', description: '13:46 Sat 12/12/2020'},
    {title: 'Being transported', description: '09:15 Sat 12/12/2020'},
  ]);

  // bs = React.createRef();

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 8,
          marginRight: 5,
        }}>
        <Text style={{fontSize: 16, color: '#666666'}}>Tracking order</Text>
        <Text
          style={{fontSize: 14, color: '#FD8209'}}
          onPress={() =>
            navigation.navigate('Your Order Detail Delivery Status Screen')
          }>
          Detail
        </Text>
      </View>
      <View style={{height: 70, overflow: 'hidden', backgroundColor: '#ffff'}}>
        <Timeline
          data={dataa}
          circleSize={14}
          circleColor="rgb(45,156,219)"
          lineColor="rgb(45,156,219)"
          lineWidth={1}
          timeContainerStyle={{minWidth: 52, marginTop: 10, height: 30}}
          descriptionStyle={{color: 'gray', paddingBottom: 10, fontSize: 11}}
          options={{
            style: {paddingTop: 5},
          }}
          titleStyle={{fontSize: 14, fontWeight: 'normal'}}
        />
      </View>

      <View>
        <View style={{height: 50, justifyContent: 'center', marginLeft: 8}}>
          <Text style={{fontSize: 16, color: '#666666'}}>Receiver</Text>
        </View>
        <View style={{paddingLeft: 15, backgroundColor: '#ffff'}}>
          <View>
            <Text style={{fontSize: 14, color: '#000000', paddingBottom: 8}}>
              Bui Gia Hoa
            </Text>
            <Text style={{fontSize: 14, color: '#000000', paddingBottom: 8}}>
              0902733275
            </Text>
            <Text style={{fontSize: 11, color: '#666666', paddingBottom: 5}}>
              20 Le Truc, Ward 7, Binh Thanh District, Ho Chi Minh
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View style={{height: 50, justifyContent: 'center', marginLeft: 8}}>
          <Text style={{fontSize: 16, color: '#666666'}}>Items</Text>
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            paddingRight: 10,
            backgroundColor: '#ffff',
            paddingLeft: 8,
          }}>
          <Image
            source={require('./Transportation.jpg')}
            style={{width: 80, height: 80, borderRadius: 10}}
          />
          <View style={{paddingLeft: 20, justifyContent: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', paddingBottom: 10}}>
              clothes clothes clothes clothes
            </Text>
            <Text style={{fontSize: 14, color: '#666666'}}>85.000 VND</Text>
          </View>
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            paddingRight: 10,
            backgroundColor: '#ffff',
            paddingLeft: 8,
          }}>
          <Image
            source={require('./Transportation.jpg')}
            style={{width: 80, height: 80, borderRadius: 10}}
          />
          <View style={{paddingLeft: 20, justifyContent: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', paddingBottom: 10}}>
              clothes clothes clothes clothes
            </Text>
            <Text style={{fontSize: 14, color: '#666666'}}>85.000 VND</Text>
          </View>
        </View>
      </View>

      <View>
        <View style={{height: 50, justifyContent: 'center', marginLeft: 8}}>
          <Text style={{fontSize: 16, color: '#666666'}}>
            Background information
          </Text>
        </View>
        <View style={{paddingLeft: 15, backgroundColor: '#ffff'}}>
          <View>
            <Text style={{fontSize: 14, color: '#000000', paddingBottom: 8}}>
              Delivery time: all days long
            </Text>
            <Text style={{fontSize: 14, color: '#000000', paddingBottom: 8}}>
              Delivery date: 30/12/2020 - 5/1/2021
            </Text>
            <Text style={{fontSize: 14, color: '#000000', paddingBottom: 8}}>
              Note: don't knock the door.
            </Text>
            <Text style={{fontSize: 14, color: '#000000', paddingBottom: 8}}>
              Total price: 135.000 VND
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default YourOrderDetailScreen;

const styles = StyleSheet.create({
  deliveryTimeList: {},

  deliveryTimeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#777',
    color: '#777',
    fontSize: 16,
    padding: 15,
  },

  deliveryTimeItemLastChild: {
    borderBottomWidth: 0,
    borderBottomColor: '#777',
    color: '#777',
    fontSize: 16,
    padding: 15,
  },

  textAreaInput: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    color: '#666666',
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlignVertical: 'top',
  },

  container: {
    flex: 1,
  },

  noteButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1BA9FF',
    alignItems: 'center',
    marginTop: 10,
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1BA9FF',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomColor: '#f2f2f2',
    borderTopColor: '#f2f2f2',
    borderRightColor: '#f2f2f2',
    borderLeftColor: '#f2f2f2',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 10,
    paddingLeft: 5,
    borderRadius: 10,
    height: 40,
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
  },
});
