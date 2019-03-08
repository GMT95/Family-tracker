export default (state = {screenChanger: false,userData: null}, action) => {
  switch (action.type) {
    case 'SAVE_TOKEN':
      return {
        ...state,
        savedToken: action.payload,
        id: null
      }
    case 'SAVE_DATA':
      console.log('In save data reducer',action.payload)
      return {
        ...state,
        savedData: action.payload
      }  
    case 'GET_AND_SAVE_DATA':
      console.log('In GET and save reducer')
      return {
        ...state,
        userData: action.payload,
        screenChanger: false
      } 
    case 'SAVE_CURRENT_LOCATION':
    console.log('In Save current location',action.payload) 
    return {
      ...state,
      currentLocation: action.payload
    } 
    case 'CIRCLE_DATA':
    console.log('In circle saving reducer')
    return {
      ...state,
      circleData: action.payload
    }
    default:
      return state;
  }
}