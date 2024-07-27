'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://127.0.0.1:8011/cavy"',
  BASE_WEBSOCKET_PATH: '"ws://127.0.0.1:8011/cavy"'

})
