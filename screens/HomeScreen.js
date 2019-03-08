import React, { Component } from 'react'
import { Text, View,ActivityIndicator } from 'react-native'
import { Location, Permissions } from 'expo'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import {connect} from 'react-redux'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {Avatar} from 'react-native-paper'
import firebase from '../config/firebase'
const Database = firebase.database();

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    drawerLabel: 'Home',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="home" size={20} color="blue" />
    ),
  };

  constructor() {
    super()
    this.locationChanged = this.locationChanged.bind(this)
    this.state = {
      location: ''
    }
  }

  componentWillMount() {
    const {savedData} = this.props
    this.getLocationAsync();
    Database.ref().child(`users/${savedData.id}`).on('value', snapshot => {
      console.log('snapshot ki value',snapshot.val());
    })
  }

  async getLocationAsync() {
    console.log('In get location async')
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
      .catch(e => console.log('An error occured', e));
    if (status !== 'granted') {
      // this.setState({
      //   errorMessage: '',
      // });
      this.showAlert()
    }

    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({ location, loading: false });
    // console.log(this.state.location);
  };

  // componentWillMount() {
  // }

  locationChanged = (location) => {
    const {savedData} = this.props;
    console.log('In watch position async')
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    },
    this.setState({location, region})
    Database.ref(`users/${savedData.id}`).update({latitude: location.coords.latitude,longitude: location.coords.longitude})
    console.log(location,region)
}

  showAlert = () => {
    Alert.alert(
      'Warning',
      'App is based on location services please press try again to save location',
      [
        { text: 'Try Again', onPress: () => this.getLocationAsync() },
        { text: 'Cancel', onPress: () => console.log('cancel pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

 


  render() {
    const {location,region} = this.state
    const {savedData} = this.props
    console.log(location,'location',region);
    return (
      location === '' ?
      <ActivityIndicator size="large" color="#0000ff" /> :
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          // initialRegion={{
          //   latitude: location.coords.latitude,
          //   longitude: location.coords.longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
          initialRegion={this.state.region}
        >
          <MapView.Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={savedData.name ? savedData.name : 'Anonymous'}
          >
          <Avatar.Image 
            size={20}
            source={{uri: savedData.picture.data.url}}
           />
          </MapView.Marker>
        </MapView>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  savedData: state.authReducer.savedData
})


export default connect(mapStateToProps,null)(HomeScreen)