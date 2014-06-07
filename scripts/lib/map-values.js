define(['lib/mori'], function (M) {

  var mapValues = function (f) {
    return function (xs) {
      return M.into(M.hash_map(), M.map(function (entry) {
        return M.vector(M.get(entry, 0), f(M.get(entry, 1)))
      }, xs))
    }
  }

  return mapValues
})