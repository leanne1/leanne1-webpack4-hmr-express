import React, { Component, Fragment } from 'react';
import Routes from '../../routes';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="app-header">Webpack HMR</header>
        <Routes />
      </div>
    );
  }
}