import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';

import './App.global.css';
import AppStart from './screens/AppStart';
import DeviceConnection from './screens/DeviceConnection';
import Home from './screens/Home';
import Layout from './screens/Layout';
import { GeistProvider, CssBaseline } from '@geist-ui/react';

const WithNavRoutes = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default function App() {
  return (
    <GeistProvider>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" component={AppStart} />
          <Route exact path="/deviceConnection" component={DeviceConnection} />
          <WithNavRoutes exact path="/home" component={Home} />
        </Switch>
      </Router>
    </GeistProvider>
  );
}
