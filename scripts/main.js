define([
  'lib/react', 'lib/bacon', 'model', 'ui'
],
  function (React, Bacon, T, UI) {

  // Application
  // -----------

  // Actions = Stream Action

  //: Actions
  var actions = new Bacon.Bus()

  var run = function (fn) {
    return function () { actions.push(fn) }
  }

  //  The state of our application is the accumulation of all the
  //  transformations applied to the state, starting at the initial app
  var app = actions.skipDuplicates()
    .scan(T.initApp, function (state, action) { return action(state) })
    .skipDuplicates()

  app.onValue(function (state) {
    React.renderComponent(UI.render(run)(state), document.body)
  })

})