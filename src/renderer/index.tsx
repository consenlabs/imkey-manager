import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './i18n';
require('../api/apiIpc');

render(<App />, document.getElementById('root'));
