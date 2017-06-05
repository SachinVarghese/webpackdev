const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const glob = require("glob");
const PurifyCSSPlugin = require('purifycss-webpack');
var bootstrapEntryPoints = require("./webpack.bootstrap.config");
var isProd = process.env.NODE_ENV==='production';
var css1 = ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: ['css-loader','sass-loader'],
  publicPath:"./dist"
});
var css2 = ['style-loader','css-loader','sass-loader']
var cssConfig = isProd?css1:css2;
var bootstrapConfig = isProd?bootstrapEntryPoints.prod:bootstrapEntryPoints.dev;
module.exports = {
  entry: {
    app: './index.js',
    contact: './src/contact.js',
    bootstrap:bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module:{
    rules:[
      {
        test: /\.scss$/, use:cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/i,
        exclude: /node_modules/,
        use: ["file-loader?name=[hash:12][name].[ext]&outputPath=images/","image-webpack-loader"]
      },
      {
        test: /\.(woff2?|svg)$/,
        use: 'url-loader?limit=10000&name=fonts/[name]'
      },
      {
        test: /\.(ttf|eot)$/,
        use: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        use: 'imports-loader?jQuery=jquery'
       }
    ]
  },
  devServer:{
    contentBase: path.resolve(__dirname, 'dist'),
    compress:true,
    port:9000,
    hot:true,
    stats:"errors-only",
    open:true
  },
  plugins: [
  new HtmlWebpackPlugin({
    title: 'Project',
    // minify:{
    //   collapseWhitespace:true
    // },
    excludeChunks:['contact'],
    hash:true,
    template: './src/index.ejs',
  }),
  new HtmlWebpackPlugin({
    title: 'Contact Page',
    minify:{
      collapseWhitespace:true
    },
    chunks:['contact','bootstrap'],
    hash:true,
    filename: 'contact.html',
    template: './src/index.ejs'
  }),
  new ExtractTextPlugin({
    filename:"/css/[name].css",
    disable:!isProd,
    allChunks:true
  }),
  new webpack.HotModuleReplacementPlugin(),
  new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.ejs')),
  })
]
};
