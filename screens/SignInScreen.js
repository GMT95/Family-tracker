import React, { Component } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { connect } from 'react-redux'
import { Constants, Expo, Facebook, Alert, Permissions, Location } from 'expo'
import firebase from '../config/firebase'
const Database = firebase.database()

export class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    console.log('In get location async')
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
   
    if (status !== 'granted') {
      // this.setState({
      //   errorMessage: '',
      // });
      this.showAlert()
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location, loading: false });
    console.log(this.state.location,'loc');
  };



  showAlert = () => {
    Alert.alert(
      'Warning',
      'App is based on location services please press try again to save location',
      [
        { text: 'Try Again', onPress: () => this.getLocationAsync() },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    )
  }


  async logIn() {
    const { dispatch, savedData } = this.props
    const { location } = this.state
    console.log('In Login function');
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('782436902132930', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
        )
          .then(res => res.json())
          .then(tokenKey => {
            //AsyncStorage.setItem('userToken',JSON.stringify(tokenKey))
            //.then(() => this.props.navigation.navigate('App'))
            console.log(tokenKey);
            dispatch({ type: 'SAVE_DATA', payload: tokenKey })
            dispatch({
              type: 'SAVE_CURRENT_LOCATION', payload: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude
              }
            })
            Database.ref(`users/${tokenKey.id}`).set({
              id: tokenKey.id,
              name: tokenKey.name,
              profilePic: tokenKey.picture.data.url,
              longitude: location.coords.longitude,
              latitude: location.coords.latitude
            })
            this.props.navigation.navigate('App');
          });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <Text>Family Tracker</Text>
        <Button title="Login with Facebook" onPress={() => this.logIn()} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  savedData: state.authReducer.savedData
})

export default connect(mapStateToProps, null)(SignInScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
