'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://yw.bsoft.com.cn:8888/bimp/"',
  BASE_API: '"http://10.0.22.85:8081/bimp"',
})
