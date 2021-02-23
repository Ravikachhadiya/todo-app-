import * as actionTypes from '../actions/actionType';

let initialState = {
    tasks: { data: [] },
    toDoList: { data: [] },
    toDoDetails: { data: [] }
}

export default function (state = initialState, action) {
    let newState = {};

    switch (action.type) {

        case actionTypes.ENTITY_FETCH:
            newState = Object.assign({}, state);
            newState[action.entity] = action.data;

            // console.log(action.data)
            // console.log(newState);
            // console.log(newState[action.entity]);

            // console.log(state);
            return newState
        case actionTypes.MAKE_NULL:
            newState = Object.assign({}, state);
            newState[action.entity] = action.data;
            return newState
        case actionTypes.RESET_TODO:
            newState = Object.assign({}, state);
            newState["toDoDetails"] = { data: [] }
            return newState
        default:
            return state

    }
}
