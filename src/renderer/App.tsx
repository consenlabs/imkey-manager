import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';

import './App.global.css';
import AppStart from './screens/AppStart';
import DeviceConnection from './screens/DeviceConnection';
import Home from './screens/Home';
import Accounts from './screens/Accounts';
import Management from './screens/Management';
import Layout from './screens/Layout';
import Setting from './screens/Setting';
import { GeistProvider, CssBaseline } from '@geist-ui/react';

// const myTheme = {
//   "type": "Custom",
//   "palette": {
//     "foreground": "#2e3035"
//   }
// }

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
    <GeistProvider >
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/deviceConnection" component={DeviceConnection} />
          <WithNavRoutes exact path="/home" component={Home} />
          <WithNavRoutes exact path="/accounts" component={Accounts} />
          <WithNavRoutes exact path="/management" component={Management} />
          <WithNavRoutes exact path="/setting" component={Setting} />
          <Route path="/" component={AppStart} />

        </Switch>
      </Router>
    </GeistProvider>
  );
}
