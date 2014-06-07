define([
  'lib/react',
  'lib/mori',
  'lib/bacon',
  'lib/lens',
  'lib/events',
  'model',
  'view/header',
  'view/toggle-all',
  'view/item'
], function (React, M, Bacon, Lens, Events, T,
             Header, ToggleAll, Item) {
  var _ = React.DOM

  var UI = {}

  //: Run Action -> App -> DOM
  UI.render = function (run) {

    var withChange = function (f) {
      return function (v) { run(f(v))() }
    }


    var renderHeader = function (app) {
      return Header.view({
        value: T.newItem.get(app),
        setValue: withChange(T.newItem.set),
        createItem: run(T.createNewItem)
      })
    }


    var renderToggleAll = function (app) {
      var empty = M.is_empty(T.items.get(app))
      var allChecked = M.every(T.done.get, M.vals(T.items.get(app)))
      return ToggleAll.view({
        visible: !empty,
        active: allChecked,
        toggle: run(T.checkAll(!allChecked))
      })
    }


    var mkEditItem = function (app) {
      var editingValue = Lens.comp(T.editing, T.editValue)
      return {
        value: editingValue.get(app),
        saveEdit: run(T.saveEdit),
        setValue: withChange(editingValue.set)
      }
    }


    var renderItem = function (app) {
      return function (entry) {
        var itemID = M.get(entry, 0)
        var item = M.get(entry, 1)
        var done = T.done.get(item)
        var isEditing = T.isEditingItem(itemID)(app)
        return Item.view({
          id: itemID,
          value: T.value.get(item),
          done: done,
          editing: isEditing && mkEditItem(app),
          startEditing: run(T.startEditing(itemID)),
          destroy: run(T.destroyItem(itemID)),
          check: run(T.checkOne(itemID)(!done))
        })
      }
    }


    var renderList = function (app) {
      var drawItem = renderItem(app)
      return _.ul({ id: 'todo-list' },
        M.into_array(M.map(drawItem,
          M.sort(function (a, b) {
            return M.get(a, 0) - M.get(b, 0)
          }, T.filteredItems(app))
        )))
    }


    var renderFilters = function (app) {
      var filter = T.filter.get(app)

      var renderFilter = function (text, value) {
        return _.li(null, _.a({
          className: (filter == value) && 'selected',
          style: { cursor: 'pointer' },
          onClick: run(T.filter.set(value))
        }, text))
      }

      return _.ul({ id: 'filters' },
        renderFilter('All', T.Filter.All),
        renderFilter('Active', T.Filter.Active),
        renderFilter('Completed', T.Filter.Completed))
    }


    var renderFooter = function (app) {
      var numActiveItems = M.count(T.activeItems(app))

      return _.footer({ id: 'footer' },
        _.span({ id: 'todo-count' },
          _.strong(null, numActiveItems),
          ' item(s) left'),

        renderFilters(app),

        _.button({
          id: 'clear-completed',
          onClick: run(T.clearCompleted)
        }, 'Clear completed (', M.count(T.completedItems(app)), ')'))
    }


    //  Generate the view based on the current state of the application
    return function (app) {
      return _.div({ id: 'todoapp' },
        _.section({ className: 'app' },
          renderHeader(app),
          _.section({ id: 'main' },
            renderToggleAll(app),
            renderList(app)),
          M.is_empty(T.items.get(app)) || renderFooter(app)))
    }
  }

  return UI
})