import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { Avatar, Button, Card, Title, Paragraph, ActivityIndicator, DarkTheme } from 'react-native-paper';
import lodash from 'lodash'
import firebase from '../config/firebase'
const Database = firebase.database()

export class MyCircles extends Component {
  static navigationOptions = {
    title: 'My Circles',
    drawerLabel: 'My Circles',
    drawerIcon: (props) => (
      <AntDesign name="meho" size={20} color="blue" />
    ),
  };

  state = {
    userCircles: []
  }

  fetchData() {
    const { savedData } = this.props
    fetch(`https://family-gps-tracker-80ce7.firebaseio.com/circles.json`)
      .then(res => res.json())
      //.then(res2 => console.log(lodash.values(res2)))
      //.then(res2 => this.setState({ userCircles: lodash.values(res2) }))
      .then(data => {
        console.log('data',data)
        let userCircles = [];
        for (let i in data) {
          if (data[i].ownerId === savedData.id) {
            data[i].isOwner = true;
          }
          if (data[i].members.includes(savedData.id)) {
            userCircles.push(data[i])
          }
        }
        this.setState({ userCircles })
        console.log(userCircles);
      })
  }

  componentDidMount() {
    this.fetchData()
  }

  openCircleView(val) {
    const {dispatch} = this.props
    if(val.isOwner === undefined) {
      delete val.joinCode
    }
    dispatch({type: 'CIRCLE_DATA',payload: val})
    this.props.navigation.navigate('CircleMapView');
  }


  render() {
    const { userCircles } = this.state;
    return (
      userCircles.length ?
        userCircles.map((val, index) => {
          return <Card key={index}>
            <Card.Content>
              <Title>Circle Name: {val.name}</Title>
              {val.isOwner ? <Paragraph>Role: Owner</Paragraph> : <Paragraph>Role: Member</Paragraph>}
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => this.openCircleView(val)}>
                Open
              </Button>
            </Card.Actions>
          </Card>
        }) :
        <ActivityIndicator size="large" color="#0000ff" />
    )
  }
}

const mapStateToProps = (state) => ({
  savedData: state.authReducer.savedData
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, null)(MyCircles)
