define([
  'lib/dom',
  'lib/type',
  'view/header'
], function (_, Type, Header) {
  var App = {}

  var check = function (app) {
    Type.assert('object', app, 'app')
  }

  App.view = function (env) {
    check(env)
    return null
  }

  return App
})