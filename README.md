# leanne1-webpack4-hmr-express

Boilerplate for a React application built using Webpack 4 with HMR on a custom Express server.

## Notes

### Nodemon

- With this setup, HMR appears to fail when the Express server is run up with `nodemon`, be warned!

### Dependencies

- `exract-text-webpack-plugin`: Use `^4.0.0-beta.0` - [webpack-contrib issue #46](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701)
