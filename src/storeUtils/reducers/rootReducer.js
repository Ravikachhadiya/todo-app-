import { combineReducers } from 'redux';

// Import custom components
import authReducer from './authReducer';
import crudReducer from './crudReducer';

// Modules
// import reduxModules from '../modules/reduxCompiler';

const rootReducer = combineReducers({
    auth: authReducer,
    // form: formReducer,
    crud: crudReducer,

});

export default rootReducer;