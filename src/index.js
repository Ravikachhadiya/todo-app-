import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
// import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import authenticateReducer from './store/reducers/Authenticate';
// import todoListReducer from './store/reducers/TodoList';

import store from './store';


const routing = (
  <Router>
    <Route path="/" component={App} />
  </Router>
)
// const rootReducer = combineReducers({
//   authenticate: authenticateReducer,
//   todoList: todoListReducer
// });

// const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    {routing}
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();