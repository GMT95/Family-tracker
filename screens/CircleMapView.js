import React, { Component } from 'react'
import { View, Text,Dimensions,StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Button } from 'react-native-paper'
import { MapView,Location,Permissions } from 'expo'
import firebase from '../config/firebase';
import { Avatar,ActivityIndicator } from 'react-native-paper'
const Database = firebase.database();
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

class CircleMapView extends Component {
  state = {
    showKey: false,
    userLocs: []
  }

  fetchUserLocations() {
    const { circleData } = this.props;
    console.log('cdm')
    // fetch(`https://family-gps-tracker-80ce7.firebaseio.com/circles.json`)
    //   .then(res => res.json())
    //   .then(data => {
    //     let userLocations = []
    //     for (let i in data) {
    //       data[i].key = i;
    //       console.log(
    //         data[i].name,
    //         circleData.name,
    //         data[i].ownerName,
    //         circleData.ownerName,
    //         circleData.members
    //       )
    //       // if (data[i].name === circleData.name && data[i].ownerName === circleData.ownerName) {
    //       //   userLocations = data[i].membersLoc
    //       //   console.log('Hello')
    //       // }

    //     }
    //     this.setState({ userLocations })
    //     console.log(userLocations, 'user location in circle map view');
    //   })     
    console.log(circleData.members, 'Circle data members')

    Database.ref().child('users').once('value').then(snapshot => {
      let data = snapshot.val();
      let userLocs = [];
      console.log(data);
      for (let i in data) {
        if (circleData.members.includes(data[i].id)) {
          userLocs.push(data[i]);
          console.log('User Locations', userLocs);
          this.setState({ userLocs })
        }
      }
    })

    Database.ref().child('users').on('child_changed', snapshot => {
      let data = snapshot.val();
      let userLocs = [];
      console.log(data);
      for (let i in data) {
        if (circleData.members.includes(data[i].id)) {
          userLocs.push(data[i]);
          console.log('User Locations', userLocs);
          this.setState({ userLocs })
        }
      }
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
  };

  locationChanged = (location) => {
    const {savedData} = this.props
    console.log('In watch position async')
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    },
    console.log('location',location)
    Database.ref(`users/${savedData.id}`).update({latitude: location.coords.latitude,longitude: location.coords.longitude})
}


  componentDidMount() {
    this.fetchUserLocations()
    this.getLocationAsync()
  }

  render() {
    console.log(this.props.circleData)
    const { showKey, userLocs } = this.state
    const { circleData, currentLocation } = this.props
    return (
      <View style={{flex: 1}}>
        {circleData.isOwner && <View>
          {showKey === false ?
            <Button mode='outlined' onPress={() => this.setState({ showKey: !showKey })}>Show Key</Button> :
            <Button mode='contained' onPress={() => this.setState({ showKey: !showKey })}>{circleData.joinCode}</Button>
          }
        </View>
        }
        <View style={{ flex: 1 }}>
          {
            userLocs.length ?
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
               {
                userLocs.map((val,index) =>
                  <MapView.Marker
                    key={`index${index}`}
                    coordinate={{
                      latitude: val.latitude,
                      longitude: val.longitude,
                    }}
                    title={val.name}
                  >
                    <Avatar.Image
                      size={20}
                      source={{ uri: val.profilePic }}
                    />
                  </MapView.Marker>
                )
              } 
             </MapView> :
             <ActivityIndicator size="large" color="aqua"  style={{marginTop: 25}}/>
          }
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  circleData: state.authReducer.circleData,
  currentLocation: state.authReducer.currentLocation,
  savedData: state.authReducer.savedData
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CircleMapView)

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width,
    height
  }
})