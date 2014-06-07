define(function () {
  var Type = {}

  Type.of = function (o) {
    return ({}).toString.call(o).slice(8, -1).toLowerCase()
  }

  Type.assert = function (t, v, n) {
    if (Type.of(v) !== t) throw new Error(n + ' must have type ' + t)
  }

  return Type
})