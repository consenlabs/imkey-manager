import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';

import './App.global.css';
import AppStart from './screens/AppStart';
import DeviceConnection from './screens/DeviceConnection';
import { GeistProvider, CssBaseline } from '@geist-ui/react'


const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GeistProvider>
    <CssBaseline />
    <Router>
      <Switch>
        <Route path="/deviceConnection" component={DeviceConnection} />
        <Route path="/" component={AppStart} />
      </Switch>
    </Router>
  </GeistProvider>
    
  );
}
