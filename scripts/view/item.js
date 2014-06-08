define([
  'lib/dom',
  'lib/type',
  'view/check',
  'view/edit-item'
], function (_, Type, Check, EditItem) {

  var Item = {}

  var checks = function (item) {
    Type.assert('object', item, 'item')
    Type.assert('number', item.id, 'item.id')
    Type.assert('boolean', item.done, 'item.done')
    Type.assert('function', item.startEditing, 'item.startEditing')
    Type.assert('function', item.destroy, 'item.destroy')
    Type.assert('function', item.check, 'item.check')
  }

  Item.view = function (env) {
    checks(env)

    var itemClass = [
      env.done ? 'completed' : '',
      env.editing ? 'editing' : ''
    ].join(' ')

    return _.li({ className: itemClass },

      _.div({ className: 'view' },
        Check.view({ active: env.done, toggle: env.check }),
        _.label({ onDoubleClick: env.startEditing }, env.value),
        _.button({ className: 'destroy', onClick: env.destroy })
      ),

      //  Only render the editing box if we are actually editing this item
      env.editing && EditItem.view(env.editing)
    )
  }

  return Item
})