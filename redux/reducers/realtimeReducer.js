export default (state = {}, action) => {
	switch(action.type) {
		case 'GET_REALTIME_DATA': 
			return {
				...state,
				message: action.payload
			}
	}
}