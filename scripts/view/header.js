define([
  'lib/dom',
  'lib/type',
  'lib/events'
], function (_, Type, Events) {

  var Header = {}

  var check = function (header) {
    Type.assert('object', header, 'header')
    Type.assert('string', header.value, 'header.value')
    Type.assert('function', header.setValue, 'header.setValue')
    Type.assert('function', header.createItem, 'header.createItem')
  }

  Header.view = function (env) {
    check(env)
    return _.header({ id: 'header' },
      _.h1(null, 'todos'),
      _.input({
        id: 'new-todo',
        type: 'text',
        autofocus: 'autofocus',
        valueLink: {
          value: env.value,
          requestChange: env.setValue
        },
        onKeyDown: Events.onEnter(env.createItem),
        placeholder: 'What needs to be done?'
      }))
  }

  return Header
})