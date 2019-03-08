import React, { Component } from 'react'
import { View, Text,StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { AntDesign } from '@expo/vector-icons';
import { TextInput,Button } from 'react-native-paper';
import {Constants} from 'expo'
import firebase from '../config/firebase'
const Database = firebase.database();
import { fetchData } from '../redux/actions/realTimeAction'

class CreateCircle extends Component {
  static navigationOptions = {
    title: 'Create Circle',
    drawerLabel: 'Create Circle',
    drawerIcon: (props) => (
      <AntDesign name="pluscircle" size={20} color="blue" />
    ),
  };

  state = {
    circleName: '',
    joinCode: ''
  }

  addCircleToDb() {
    const {savedData,currentLocation} = this.props;
    const {circleName,joinCode} = this.state
    userId = savedData.id;
    Database.ref(`circles/`).push({
      name: circleName,
      ownerName: savedData.name,
      ownerId: savedData.id,
      joinCode: joinCode, 
      ownerProfilePic: savedData.picture.data.url,
      members: [savedData.id],
      membersLoc: [{
            id: userId,
            longitude: currentLocation.longitude,
            latitude: currentLocation.latitude
          
      }]
    }).then(_ => {
      this.setState({circleName: '',joinCode: ''})
      this.props.navigation.navigate('Home')
    })
  }

  render() {
    return (
      <View style={{flex: 1,padding: 10}}>
        <TextInput
          label='Enter Circle Name'
          value={this.state.circleName}
          onChangeText={circleName => this.setState({ circleName })}
        />
        <TextInput
          label='Join Code'
          value={this.state.joinCode}
          onChangeText={joinCode => this.setState({ joinCode })}
        />
        <Button 
          mode="contained"
          onPress={() => this.addCircleToDb()}
        >Create</Button>
        <Button
          mode="contained"
          onPress={() => this.props.fetchData()}
        >Fetch Data from Firebase</Button>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  savedData: state.authReducer.savedData,
  currentLocation: state.authReducer.currentLocation
})


export default connect(mapStateToProps, {fetchData})(CreateCircle)

const styles = StyleSheet.create({
  containerStart: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

