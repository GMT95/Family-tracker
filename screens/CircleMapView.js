import React, { Component } from 'react'
import { View, Text,Dimensions,StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Button } from 'react-native-paper'
import { MapView,Constants } from 'expo'
import firebase from '../config/firebase';
import { Avatar,ActivityIndicator } from 'react-native-paper'
const Database = firebase.database();
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


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
    Database.ref().child('users').on('value', snapshot => {
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


  componentDidMount() {
    this.fetchUserLocations()
  }

  render() {
    console.log(this.props.circleData)
    const { showKey, userLocs } = this.state
    const { circleData, currentLocation } = this.props
    //console.log('User data remove after use',currentLocation)
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
                userLocs.map((val) =>
                  <MapView.Marker
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
          <Text>Hello</Text>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  circleData: state.authReducer.circleData,
  currentLocation: state.authReducer.currentLocation
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