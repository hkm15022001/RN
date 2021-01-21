import React, {useState} from 'react';
import {Avatar, Chip, Card, Button, Paragraph, FAB} from 'react-native-paper';
import {StyleSheet, View, Text, FlatList, Animated} from 'react-native';

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

const HomeScreen = ({navigation}) => {
  // Source: https://github.com/mukeshphulwani66/Youtube-clone-React-Native/blob/master/src/screens/Home.js
  // Youtube: https://www.youtube.com/watch?v=mvxgWuxwnik
  // Hide header when scroll up
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 1, 96); // 96 is the height of header
  const translateY = diffClamp.interpolate({
    inputRange: [1, 96],
    outputRange: [1, -96],
  });

  const [dataHome, setDataHome] = useState([
    {
      id: '1',
      title: 'Delivery orders success',
      subtitle: '11/1/2020',
      content: 'Your order was delivered successfully.',
      image: require('../../assets/picture/voucher.jpg'),
    },
    {
      id: '2',
      title: 'Delivery orders success',
      subtitle: '11/1/2020',
      content: 'Your order was delivered successfully.',
      image: require('../../assets/picture/voucher.jpg'),
    },
    {
      id: '3',
      title: 'Delivery orders success',
      subtitle: '11/1/2020',
      content: 'Your order was delivered successfully.',
      image: require('../../assets/picture/voucher.jpg'),
    },
    {
      id: '4',
      title: 'Delivery orders success',
      subtitle: '11/1/2020',
      content: 'Your order was delivered successfully.',
      image: require('../../assets/picture/voucher.jpg'),
    },
    {
      id: '5',
      title: 'Delivery orders success',
      subtitle: '11/1/2020',
      content: 'Your order was delivered successfully.',
      image: require('../../assets/picture/voucher.jpg'),
    },
    {
      id: '6',
      title: 'Delivery orders success',
      subtitle: '11/1/2020',
      content: 'Your order was delivered successfully.',
      image: require('../../assets/picture/voucher.jpg'),
    },
  ]);

  return (
    <View style={styles.container}>
      <Animated.View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          transform: [{translateY: translateY}],
          elevation: 4,
          zIndex: 100,
        }}>
        <View style={styles.headerContainer}>
          <Text style={styles.textHeader}>What's new ?</Text>

          <View style={styles.rowFlexContainer}>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => console.log('Pressed')}>
              All
            </Chip>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => console.log('Pressed')}>
              News
            </Chip>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => console.log('Pressed')}>
              Voucher
            </Chip>
            <Chip
              style={styles.rowFlexItem}
              onPress={() => console.log('Pressed')}>
              Promotion
            </Chip>
          </View>
        </View>
      </Animated.View>

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        numColumns={1}
        keyExtractor={(item) => item.id}
        data={dataHome}
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        renderItem={({item}) => (
          <View style={styles.flatListItem}>
            <Card>
              <Card.Title
                title={item.title}
                subtitle={item.subtitle}
                left={LeftContent}
              />
              <Card.Content>
                <Paragraph>{item.content}</Paragraph>
              </Card.Content>
              <Card.Cover source={item.image} />
              <Card.Actions style={styles.cardAction}>
                <Button onPress={() => navigation.navigate('Create An Order')}>
                  Select
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
          onPress={() => navigation.navigate('Create order')}
          color="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    marginBottom: 10,
  },
  fab: {
    position: 'relative',
    backgroundColor: '#ed8d40',
    left: '-50%',
  },

  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    //alignItems:'center',
  },

  headerContainer: {
    height: 96,
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
    paddingTop: 106, //96+5
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
