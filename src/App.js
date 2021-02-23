import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route } from 'react-router-dom';

import Aux from './hoc/Aux';
import Layout from './hoc/Layout/Layout';
import './App.css';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import ToDoApp from './container/ToDoApp';

class App extends Component {
  render() {

    let isLogin = JSON.parse(localStorage.getItem('isLogin'));
    return (
      <div className="App">
        <Aux>
          <Layout>
            {isLogin ? <ToDoApp /> : null}
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
          </Layout>
        </Aux>
      </div>
    );
  }

}
export default App;