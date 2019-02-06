const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

// Webpack entry points used in both dev and prod
const commonEntries = ['babel-polyfill', './src/client/app/index.js'];

// Extract prebuilt (vendor) CSS into file if needed
const extractCss = new ExtractTextPlugin({
  filename: 'vendor.[hash].css'
});

// Extract the Sass output into a CSS file
const extractSass = new ExtractTextPlugin({
  filename: 'style.[hash].css',
  disable: false,
  allChunks: true
});

// Config used by all envs
const commonConfig = {
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist/client'),
    publicPath: '/',
  },
  // When symlinking a node_module package, make imports resolve to symlink
  resolve: {
    symlinks: false
  },
  // Enable source maps
  devtool: 'source-map',
  module: {
    rules: [
      // Bundle JS using babel; include custom component library if needed
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!custom-component-library)/,
        use: {
          loader: 'babel-loader'
        }
      },
      // Extract prebuilt CSS as a separate file if needed
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/client/styles/vendor/vendor.css'),
        loader: extractCss.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      // Extract all assets as separate files
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    // Interpolate env vars into bundle if needed
    // Adds SOME_ENV_VAR to global namespace
    new webpack.DefinePlugin({
      SOME_ENV_VAR: JSON.stringify(process.env.SOME_ENV_VAR)
    }),
    // Generate index html with built bundle paths injected
    new HtmlWebPackPlugin({
      template: 'src/client/index.html',
      filename: 'index.html'
    }),
    extractCss
  ]
};

// Dev-only config
const devConfig = {
  mode: 'development',
  entry: ['webpack-hot-middleware/client', ...commonEntries],
  module: {
    rules: [
      // In dev, keep built Sass modules in the JS bundle to allow HMR for styles
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'resolve-url-loader', // resolve url import paths in node_modules package Sass modules
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // Support HMR
    new webpack.HotModuleReplacementPlugin()
  ]
};

// Prod-only config
const prodConfig = {
  mode: 'production',
  entry: commonEntries,
  module: {
    rules: [
      // Build Sass modules into a separate css file
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'postcss-loader',
            'resolve-url-loader', // resolve url import paths in node_modules package Sass modules
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    // Clean the dist folder on each build
    new CleanWebpackPlugin('dist'),
    extractSass
  ]
};

module.exports = isDev ? merge(commonConfig, devConfig) : merge(commonConfig, prodConfig);
