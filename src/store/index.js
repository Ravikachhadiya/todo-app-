import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import history from '../utils/history';
import rootReducer from '../storeUtils/reducers/rootReducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = routerMiddleware(history);
const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunkMiddleware, middleware)
));

export default store;