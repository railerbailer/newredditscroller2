import React from 'react';
import './index.css';
import App from './App';
import {HashRouter} from 'react-router-dom'
import { hydrate, render } from 'react-dom';

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(<HashRouter><App /></HashRouter>, rootElement);
} else {
  render(<HashRouter><App /></HashRouter>, rootElement);
}
