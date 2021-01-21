import React, {useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MainNotifications = () => {
  const [people, setPeople] = useState([
    {
      id: '1',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '2',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '3',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '4',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '5',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '6',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '7',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
    {
      id: '8',
      title: 'Delivery orders success',
      date: '11/1/2020',
      description: 'Your order was delivered successfully.',
      iconType: 'info',
    },
  ]);

  return (
    <FlatList
      style={styles.taskList}
      numColumns={1}
      keyExtractor={(item) => item.id}
      data={people}
      renderItem={({item}) => (
        <View style={styles.taskItem}>
          <View style={styles.taskItemHeader}>
            <View>
              <Icon name="information" color="#1BA9FF" size={25} />
            </View>
            <View style={{paddingLeft: 10}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {item.title}
              </Text>
              <Text style={{fontSize: 11, color: '#777777'}}>{item.date}</Text>
            </View>
          </View>
          <Text style={{fontSize: 16, color: '#777777'}}>
            {item.description}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },

  taskItem: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#777777',
    paddingBottom: 5,
  },

  taskItemHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default MainNotifications;
