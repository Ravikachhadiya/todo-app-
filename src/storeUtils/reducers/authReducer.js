import * as actionTypes from '../actions/actionType';

const initialState = {
    isLogin: JSON.parse(localStorage.getItem('isLogin'))
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            localStorage.setItem('isLogin', JSON.stringify(true));
            return {
                isLogin: true
            }
        case actionTypes.LOGOUT:
            localStorage.setItem('isLogin', JSON.stringify(false));
            localStorage.setItem('currentUser', JSON.stringify(null));
            return {
                isLogin: false
            }
        default:
            return state;
    }
}

export default reducer;
