import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Button } from 'react-native-paper'
import firebase from '../config/firebase';
const Database = firebase.database();

class CircleMapView extends Component {
  state = {
    showKey: false
  }

  fetchUserLocations() {
    const { circleData } = this.props;
    console.log('cdm')
    fetch(`https://family-gps-tracker-80ce7.firebaseio.com/circles.json`)
      .then(res => res.json())
      .then(data => {
        let userLocations = []
        for (let i in data) {
          data[i].key = i;
          console.log(
            data[i].name,
            circleData.name,
            data[i].ownerName,
            circleData.ownerName
          )
          if (data[i].name === circleData.name && data[i].ownerName === circleData.ownerName) {
            userLocations = data[i].membersLoc
            console.log('Hello')
          }
        }
        this.setState({ userLocations })
        console.log(userLocations);
      })
  }

  componentDidMount() {
    this.fetchUserLocations()
  }

  render() {
    console.log(this.props.circleData)
    const { showKey,userLocations } = this.state
    const { circleData } = this.props
    return (
      <View>
        {circleData.isOwner && <View>
          {showKey === false ?
            <Button mode='outlined' onPress={() => this.setState({ showKey: !showKey })}>Show Key</Button> :
            <Button mode='contained' onPress={() => this.setState({ showKey: !showKey })}>{circleData.joinCode}</Button>
          }
        </View>
        }
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
            />
          </MapView>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  circleData: state.authReducer.circleData
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CircleMapView)
