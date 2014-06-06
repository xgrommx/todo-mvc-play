define(['lib/mori', 'lib/lens'], function (M, Lens) {

  var struct = function () {
    var keys = [].slice.call(arguments)

    var ctor = function () {
      return M.zipmap(keys, [].slice.call(arguments))
    }

    keys.forEach(function (key) {
      ctor[key] = Lens.keyLens(key)
    })

    return ctor
  }

  return struct
})