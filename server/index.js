const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const port = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

// Serve static files
if (isDev) {
  // For webpack HMR
  const config = require('../webpack.config.js');
  const history = require('connect-history-api-fallback');
  const compiler = webpack(config);
  app.use(history()); // Allow webpack dev app to pass-through React-router routes
  app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use('/', express.static('dist'));
  app.use('/dist', express.static('dist'));
}

// Frontend routes
app.get('/', (req, res) => res.sendFile(`${__dirname}/dist/index.html`));

// Run app
app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(`Listening on http://localhost:${port}...`);
});
