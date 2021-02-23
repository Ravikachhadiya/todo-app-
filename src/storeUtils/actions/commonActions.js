import * as actionTypes from './actionType';

export function fetch(entity, data) {
    return {
        type: actionTypes.ENTITY_FETCH,
        entity: entity,
        data: data
    }
}