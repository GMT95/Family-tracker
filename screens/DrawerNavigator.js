import * as React from 'react';
import { Text, View, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, createAppContainer, DrawerItems, SafeAreaView } from 'react-navigation';
import HomeScreen from './HomeScreen';
import CreateCircle from './CreateCircle'
import MyCircles from './MyCircles'
import JoinCircle from './JoinCircle'



const MyDrawerNavigator = createDrawerNavigator(
{
  Home: {
    screen: HomeScreen,

  },
  CreateCircle: {
    screen: CreateCircle,
  },
  MyCircles: {
    screen: MyCircles
  },
  JoinCircle: {
    screen: JoinCircle
  }
  // GetServices: {
  //   screen: GetServicesScreen
  // },
  // MyOrders: {
  //   screen: MyOrdersScreen
  // },
  // OrderRequest: {
  //   screen: OrderRequestScreen
  // }
},
// { 
//   initialRouteName: 'Home', 
// } initial route name does not work change in stack navigator in app.js
);

export default createAppContainer(MyDrawerNavigator);

