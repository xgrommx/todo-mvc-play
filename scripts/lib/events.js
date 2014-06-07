define(function () {
  var Events = {}

  Events.onEnter = function (f) {
    return function (e) {
      if (e.which === 13) {
        f()
        return false
      }
      return true
    }
  }

  return Events
})