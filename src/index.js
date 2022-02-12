import React from 'react';
import ReactDOM from 'react-dom';
import RootCmp from './RootCmp.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/styles/style.scss';

ReactDOM.render(
  <Router>
    <RootCmp />
  </Router>,
  document.getElementById('root')
);