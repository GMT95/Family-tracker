import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Button, Card, Title, Paragraph, ActivityIndicator,TextInput } from 'react-native-paper';
import firebase from 'firebase';
const Database = firebase.database();

export class JoinCircle extends Component {
  static navigationOptions = {
    title: 'Join Circles',
    drawerLabel: 'Join Circles',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="hand-peace-variant" size={20} color="blue" />
    ),
  };

  state = {
    userCircles: [],
    joinCode: '',
  }

  componentDidMount() {
    const { savedData } = this.props
    fetch(`https://family-gps-tracker-80ce7.firebaseio.com/circles.json`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        let userCircles = [];
        for (let i in data) {
          data[i].key = i;
          if (!data[i].members.includes(savedData.id)) {
            userCircles.push(data[i])
          }
        }
        this.setState({ userCircles })
        console.log(this.state.userCircles)
      })
  }

  joinCircleAsMember(val) {
    const {savedData,currentLocation} = this.props
    console.log(this.state.joinCode,val.joinCode)
    if(this.state.joinCode === val.joinCode) {
      fetch(`https://family-gps-tracker-80ce7.firebaseio.com/circles/${val.key}.json`)
      .then(res => res.json())
      .then(res2 => {
        membersArray = res2.members
        //membersLocArray = res2.membersLoc
        //console.log(membersLocArray,'membersLocArray');
        membersArray.push(savedData.id)
        //membersLocArray.push({id: savedData.id,longitude: currentLocation.longitude,latitude: currentLocation.latitude})
        Database.ref(`circles/${val.key}`).update({members: membersArray})
      })
      .then(() => this.props.navigation.navigate('Home'))
    } else {
      alert('Incorrect Code');
      this.setState({joinCode: ''})
    }
  }

  render() {
    const { userCircles } = this.state;
    return (
      //userCircles.length ?
        userCircles.map((val, index) => {
          return <Card key={index}>
            <Card.Content>
              <Title>Circle Name: {val.name}</Title>
              <Paragraph>{val.ownerName}</Paragraph>
              <TextInput
                label='Join Code'
                value={this.state.joinCode}
                onChangeText={joinCode => this.setState({ joinCode })}
              />
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => this.joinCircleAsMember(val)}>
                Join
              </Button>
            </Card.Actions>
          </Card> 
        }) 
        //: <ActivityIndicator size="large" color="#0000ff" />
    )
  }
}



const mapStateToProps = (state) => ({
  savedData: state.authReducer.savedData,
  currentLocation: state.authReducer.currentLocation
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, null)(JoinCircle)
