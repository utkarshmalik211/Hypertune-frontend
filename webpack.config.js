module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    port: 8888,
    // Send API requests on localhost to API server get around CORS.
    proxy: {
       '/api': {
          target: {
             host: "0.0.0.0",
             protocol: 'http:',
             port: 8080
          },
          pathRewrite: {
             '^/api': ''
          }
       }
    }
 },
};