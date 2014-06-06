define([
  'lib/mori',
  'lib/lens',
  'lib/struct',
  'lib/mapValues'
], function (M, Lens, struct, mapValues) {

  //: () -> {State} ItemID
  var genItemID = (function () {
    var counter = 0
    return function () { return (++counter) }
  })()


  // Data structures
  // ---------------

  var T = {}

  T.Item = struct
  ( 'value'   // String    -- The text value
  , 'done'    // Boolean   -- Whether or not it is completed
  )

  // -- a list is a set of unique items
  // List = Map ItemID Item
  T.List = M.hash_map

  T.Filter = {
    All: 'All',
    Active: 'Active',
    Completed: 'Completed'
  }

  T.Edit = struct
  ( 'editID'      // ItemID
  , 'editValue'   // String
  )

  T.App = struct
  ( 'items'     // List       -- the items in the todo list
  , 'filter'    // Filter     -- how we're filtering the items
  , 'newItem'   // String     -- the value of the new item
  , 'editing'   // Maybe Edit -- possible editing information
  )


  T.initApp = T.App(
    // No items to begin with
    T.List(),
    // Show everything
    T.Filter.All,
    // New item initially empty
    "",
    // Not editing anything
    null)


  // Lenses
  // ------

  //: Lens Item String
  T.value = T.Item.value
  //: Lens Item Boolean
  T.done = T.Item.done

  //: Lens Edit String
  T.editID = T.Edit.editID
  //: Lens Edit String
  T.editValue = T.Edit.editValue

  //: Lens App List
  T.items = T.App.items
  //: Lens App String
  T.newItem = T.App.newItem
  //: Lens App Filter
  T.filter = T.App.filter
  //: Lens App (Maybe Edit)
  T.editing = T.App.editing

  //: ItemID -> Lens App Item
  T.theItem = function (itemID) {
    return Lens.comp(T.items, Lens.keyLens(itemID))
  }


  // Operations
  // ----------

  //: ItemID * Item -> List -> List
  var addItem = function (genID, item) {
    return function (list) {
      return (T.value.get(item).trim().length > 0) ?
        M.assoc(list, genID, item) :
        list }
  }

  //: ItemID -> List -> List
  var removeItem = function (genID) {
    return function (list) { return M.dissoc(list, genID) }
  }

  //: App -> App
  T.createNewItem = function (app) {
    var newItem = T.Item(T.newItem.get(app), false)
    return M.comp(
      // Add the new item
      T.items.mod(addItem(genItemID(), newItem)),
      // Clear the new item text
      T.newItem.set('')
    )(app)
  }

  //: ItemID -> App -> App
  T.destroyItem = M.comp(T.items.mod, removeItem)

  //: ItemID -> App -> App
  T.checkOne = function (itemID) {
    return M.comp(T.theItem(itemID).mod, T.done.set)
  }

  //: App -> App
  T.checkAll = M.comp(T.items.mod, mapValues, T.done.set)

  //: ItemID * Item -> Boolean
  var isDone = function (entry) {
    return T.done.get(M.get(entry, 1))
  }

  //: ItemID * Item -> Boolean
  var isActive = function (entry) {
    return !isDone(entry)
  }

  //: (ItemID * Item -> Boolean) -> App -> List
  var retrieveItems = function (f) {
    return function (app) {
      return M.into(M.hash_map(),
        M.filter(f, T.items.get(app)))
    }
  }

  //: App -> List
  T.activeItems = retrieveItems(isActive)

  //: App -> List
  T.completedItems = retrieveItems(isDone)

  //: App -> App
  T.clearCompleted = function (app) {
    return T.items.set(T.activeItems(app))(app)
  }

  //: App -> Items
  T.filteredItems = function (app) {
    var filter = T.filter.get(app)
    var getter = 
      (filter === T.Filter.Active) ? T.activeItems :
      (filter === T.Filter.Completed) ? T.completedItems :
      T.items.get
    return getter(app)
  }

  //: ItemID -> App -> App
  T.startEditing = function (itemID) {
    return function (app) {
      var item = M.get(T.items.get(app), itemID)
      return item ? T.editing.set(
        T.Edit(itemID, T.value.get(item)
      ))(app) : app
    }
  }

  //: App -> App
  T.saveEdit = function (app) {
    var edit = T.editing.get(app)
    if (edit) {
      var itemID = T.editID.get(edit)
      var editValue = T.editValue.get(edit)
      var action = (editValue.trim().length > 0) ? M.comp(
        T.editing.set(null),
        T.theItem(itemID).mod(T.value.set(editValue))
      ) : T.destroyItem(itemID)
      return action(app)
    }
    return app
  }

  //: ItemID -> App -> Boolean
  T.isEditingItem = function (itemID) {
    return function (app) {
      var edit = T.editing.get(app)
      return (!!edit) && (T.editID.get(edit) === itemID)
    }
  }

  return T
})