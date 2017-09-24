const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    loaders: [
      // Load styling
      {
        test: /\.(css|scss)$/,
        loader: [
          'style-loader',
          { loader: 'css-loader', options: { modules: false } },
          'sass-loader',
        ],
      },
      // Load graphical assets
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: { limit: 25000, },
      },
      // Load fonts
      {
        test: /\.(woff|woff2)?$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          mimetype: 'application/font-woff',
          name: './fonts/[name].[ext]',
        },
      },
      // Build React and JavaScript code.
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // Bundle any static files with their original unmangled file names.
      // Use sparingly!
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader',
        options: {
          name: './[name].[ext]',
        },
        include: /static/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
}
