import firebase from "../../config/firebase";
const Database = firebase.database();


export const fetchData = _ => (dispatch) =>  {
	Database.ref('circles/').on('value',(snapshot) => {
		console.log(snapshot.val())
		dispatch({
			type: 'GET_REALTIME_DATA',
			payload: snapshot.val()
		})
	})
}