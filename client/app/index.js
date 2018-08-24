/* global document */
import '../styles/style.scss';
import '../styles/vendor/vendor.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

// All React modules in app tree accept HMR updates starting with parent node
if (module.hot) {
  module.hot.accept('./components/App/index.js', () => {
    const NextRoutes = require('./components/App/index.js').default;
    render(NextRoutes);
  });
}
