define([
  'lib/dom',
  'lib/type'
], function (_, Type) {

  var ToggleAll = {}

  var checks = function (toggle) {
    Type.assert('object', toggle, 'toggle')
    Type.assert('boolean', toggle.visible, 'toggle.visible')
    Type.assert('boolean', toggle.active, 'toggle.active')
    Type.assert('function', toggle.toggle, 'toggle.toggle')
  }

  ToggleAll.view = function (env) {
    checks(env)
    return env.visible ? _.input({
      id: 'toggle-all',
      type: 'checkbox',
      checked: env.active,
      onChange: env.toggle
    }) : null
  }

  return ToggleAll
})