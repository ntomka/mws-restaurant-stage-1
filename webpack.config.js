const webpack = require('webpack');
const Encore = require('@symfony/webpack-encore');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

Encore
  // the project directory where compiled assets will be stored
  .setOutputPath('dist/')
  // the public path used by the web server to access the previous directory
  .setPublicPath('/dist')
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())

  // uncomment to define the assets of the project
  .addEntry('main', './js/main.js')
  .addEntry('restaurant_info', './js/restaurant_info.js')
  // .addStyleEntry('styles', './css/styles.css')
  .addStyleEntry('styles', './css/styles.scss')

  .enableSassLoader()

  .configureBabel(babelConfig => {
    babelConfig.presets.push('stage-3');
    babelConfig.plugins.push('syntax-dynamic-import');

    for (let i = 0; i < babelConfig.presets.length; i++) {
      for (let j = 0; j < babelConfig.presets[i].length; j++) {
        if (babelConfig.presets[i][j] === 'env') {
          babelConfig.presets[i][j + 1].targets.browsers = ['> 1%', 'last 2 versions', 'ie >= 10'];
        }
      }
    }
  })

  .addPlugin(
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    })
  );

const siteConfig = Encore.getWebpackConfig();

// Remove the old version of uglify js first
siteConfig.plugins = siteConfig.plugins.filter(
  plugin => !(plugin instanceof webpack.optimize.UglifyJsPlugin)
);

// Add the new one
siteConfig.plugins.push(new UglifyJsPlugin());

siteConfig.name = 'siteConfig';

Encore.reset();

Encore
  .setOutputPath('./')
  .setPublicPath('/')
  .enableSourceMaps(!Encore.isProduction())
  .addEntry('sw', './js/sw.js')
  .configureBabel(babelConfig => {
    babelConfig.presets.push('stage-3');
    babelConfig.plugins.push('syntax-dynamic-import');

    for (let i = 0; i < babelConfig.presets.length; i++) {
      for (let j = 0; j < babelConfig.presets[i].length; j++) {
        if (babelConfig.presets[i][j] === 'env') {
          babelConfig.presets[i][j + 1].targets.browsers = ['> 1%', 'last 2 versions', 'ie >= 10'];
        }
      }
    }
  })
  .addPlugin(
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    })
  );

const swConfig = Encore.getWebpackConfig();

swConfig.name = 'swConfig';

module.exports = [siteConfig, swConfig];
