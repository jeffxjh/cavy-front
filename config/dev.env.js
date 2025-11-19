'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.2.2:8011/cavy"',
  BASE_API: '"http://localhost:8011/cavy"',
  BASE_WEBSOCKET_PATH: '"ws://192.168.2.2:8011/cavy"'

})
