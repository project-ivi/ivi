const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    clientLogLevel: 'none',
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    inline: true,
    port: 9000,
    watchContentBase: true,
  },
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      // Load styling
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          { loader: 'css-loader', },
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
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file-loader',
      },
      // Build React and JavaScript code.
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'include_in_dist', to: '', }
    ]),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
