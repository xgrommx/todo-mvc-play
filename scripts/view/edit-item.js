define([
  'lib/dom',
  'lib/type',
  'lib/events'
], function (_, Type, Events) {

  var EditItem = {}

  var checks = function (editItem) {
    Type.assert('object', editItem, 'editItem')
    Type.assert('string', editItem.value, 'editItem.value')
    Type.assert('function', editItem.setValue, 'editItem.value')
    Type.assert('function', editItem.saveEdit, 'editItem.saveEdit')
  }

  EditItem.view = function (env) {
    checks(env)
    return _.input({
      className: 'edit',
      type: 'text',
      autoFocus: 'autofocus',
      onKeyDown: Events.onEnter(env.saveEdit),
      onBlur: env.saveEdit,
      valueLink: {
        value: env.value,
        requestChange: env.setValue
      }
    })
  }

  return EditItem
})