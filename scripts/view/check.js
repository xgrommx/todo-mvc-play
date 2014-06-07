define([
  'lib/dom',
  'lib/type'
], function (_, Type) {

  var Check = {}

  var checks = function (check) {
    Type.assert('object', check, 'check')
    Type.assert('boolean', check.active, 'check.active')
    Type.assert('function', check.toggle, 'check.toggle')
  }

  Check.view = function (env) {
    checks(env)
    return _.input({
      className: 'toggle',
      type: 'checkbox',
      checked: env.active,
      onChange: env.toggle
    })
  }

  return Check
})