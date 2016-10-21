var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;

var base = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015'],
          plugins: [
            "syntax-flow",
            "tcomb",
            "transform-flow-strip-types"
          ]
        }
      }
    ]
  }
};


if (TARGET == 'build') {
  // Build the module bundle to the dist/ folder
  module.exports = merge(base, {
    entry: {
      contentSlider: "./src/ContentSlider.js"
    },
    // Export ContentSlider as Library
    output: {
      path: "dist",
      filename: "ContentSlider.js",
      // export itself to a global var
      libraryTarget: "var",
      // name of the global var: "ContentSlider"
      library: "ContentSlider"
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      })
    ]
  });
} else if (TARGET == 'start') {
  // Start the development mode (webpack-dev-server) and serve `dev/index.html`
  module.exports = merge(base, {
    entry: {
      app: "./demo/app.js"
    },
    output: {
        path: "dist",
        filename: "demo.js"
    },
    devServer: {
      contentBase: 'dist/'
    }
  });
} else {
  module.exports = base;
}