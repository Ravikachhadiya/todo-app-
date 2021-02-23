import * as commonAction from './commonActions';
import { postData } from '../httpUtil';
import { MAKE_NULL, RESET_TODO } from './actionType'

export function postAll(entity, data, entityName) {
    return function (dispatch) {
        return postData(entity, data).then((response) => {
            dispatch(commonAction.fetch(entityName, response.data));
        })
    };
}

export const makeReduxNull = (entity, value) => {
    return function (dispatch) {
        return dispatch({ type: MAKE_NULL, entity: entity, data: value })
    }
}

export const resetTodo = () => {
    return function (dispatch) {
        return dispatch({ type: RESET_TODO })
    }
}