define([
  'lib/react',
  'lib/mori',
  'lib/bacon',
  'lib/lens',
  'model'
], function (React, M, Bacon, Lens, T) {
  var _ = React.DOM

  var V = {}

  //: (() -> a) -> Event -> Boolean?
  var onEnter = function (f) {
    return function (e) {
      if (e.which === 13) {
        f()
        return false
      }
      return true
    }
  }

  var renderHeader = function (run, app) {
    return _.header({ id: 'header' },
      _.h1(null, 'todos'),
      _.input({
        id: 'new-todo',
        type: 'text',
        autofocus: 'autofocus',
        valueLink: {
          value: T.newItem.get(app),
          requestChange: function (v) { run(T.newItem.set(v))() }
        },
        onKeyDown: onEnter(run(T.createNewItem)),
        placeholder: 'What needs to be done?'
      }))
  }

  var renderToggleAll = function (run, app) {
    var empty = M.is_empty(T.items.get(app))
    var allChecked = M.every(T.done.get, M.vals(T.items.get(app)))
    return empty ? null : _.input({
      id: 'toggle-all',
      type: 'checkbox',
      checked: allChecked,
      onChange: run(T.checkAll(!allChecked))
    })
  }

  var renderEditItem = function (run, app) {
    var edit = T.editing.get(app)
    return _.input({
      className: 'edit',
      type: 'text',
      autofocus: 'autofocus',
      onKeyDown: onEnter(run(T.saveEdit)),
      onBlur: run(T.saveEdit),
      valueLink: {
        value: T.editValue.get(edit),
        requestChange: function (v) {
          run(T.editing.mod(T.editValue.set(v)))()
        }
      }
    })
  }

  var renderItemCheck = function (run, itemID, done) {
    return _.input({
      className: 'toggle',
      type: 'checkbox',
      checked: done,
      onChange: run(T.checkOne(itemID)(!done))
    })
  }

  var renderItem = function (run, app) {
    return function (entry) {
      var itemID = M.get(entry, 0)
      var item = M.get(entry, 1)
      var done = T.done.get(item)
      var editing = T.isEditingItem(itemID)(app)

      var className = [
        done ? 'completed' : '',
        editing ? 'editing' : ''
      ].join(' ')

      return _.li({ className: className },
        _.div({ className: 'view' },
          renderItemCheck(run, itemID, done),
          _.label({ onDoubleClick: run(T.startEditing(itemID)) },
            T.value.get(item)),
          _.button({ className: 'destroy',
            onClick: run(T.destroyItem(itemID)) })
        ),
        editing && renderEditItem(run, app))
    }
  }

  var renderList = function (run, app) {
    var drawItem = renderItem(run, app)
    return _.ul({ id: 'todo-list' },
      M.into_array(M.map(drawItem,
        M.sort(function (a, b) {
          return M.get(a, 0) - M.get(b, 0)
        }, T.filteredItems(app))
      )))
  }

  var renderMain = function (run, app) {
    return _.section({ id: 'main' },
      renderToggleAll(run, app),
      renderList(run, app))
  }


  var renderFilters = function (run, app) {
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

  var renderFooter = function (run, app) {
    var numActiveItems = M.count(T.activeItems(app))

    return _.footer({ id: 'footer' },
      _.span({ id: 'todo-count' },
        _.strong(null, numActiveItems),
        ' item(s) left'),

      renderFilters(run, app),

      _.button({
        id: 'clear-completed',
        onClick: run(T.clearCompleted)
      }, 'Clear completed (', M.count(T.completedItems(app)), ')'))
  }

  //: Run Action -> App -> DOM
  V.render = function (run) {
    //  Generate the view based on the current state of the application
    return function (app) {
      return _.div({ id: 'todoapp' },
        _.section({ className: 'app' },
          renderHeader(run, app),
          renderMain(run, app),
          M.is_empty(T.items.get(app)) || renderFooter(run, app)))
    }
  }

  return V
})