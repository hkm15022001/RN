import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';

const YourOrderDetailDeliveryStatusScreen = () => {
  const [dataa, setData] = useState([
    {title: 'Delivered successfully', description: '13:46 Sat 12/12/2020'},
    {title: 'Being transported', description: '09:15 Sat 12/12/2020'},
    {title: 'Handing over shipping', description: '8:40 Sat 12/12/2020'},
    {title: 'Packing completed', description: '08:22 Sat 12/12/2020'},
    {title: 'Picking up the goods', description: '08:12 Sat 12/12/2020'},
    {title: 'Creating an order', description: '08:11 Sat 12/12/2020'},
  ]);
  return (
    <ScrollView style={{flex: 1, height: 300}}>
      <View style={{paddingTop: 10}}>
        <Timeline
          data={dataa}
          circleSize={14}
          circleColor="rgb(45,156,219)"
          lineColor="rgb(45,156,219)"
          lineWidth={1}
          timeContainerStyle={{minWidth: 52, marginTop: 5, height: 30}}
          descriptionStyle={{
            color: 'gray',
            paddingBottom: 5,
            borderBottomWidth: 1,
            borderColor: 'gray',
          }}
          options={{
            style: {paddingTop: 5},
          }}
          titleStyle={{fontSize: 18, fontWeight: 'normal'}}
        />
      </View>
    </ScrollView>
  );
};

export default YourOrderDetailDeliveryStatusScreen;
