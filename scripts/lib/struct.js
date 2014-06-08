define(['lib/mori', 'lib/lens'], function (M, Lens) {

  /** Build a mori hash_map structure constructor with appropriate lenses
    * defined for each field.
    * 
    * var Pair = struct('fst', 'snd')
    * var p = Pair(10, 20)
    * Pair.fst.get(p) == 10
    * Pair.snd.get(p) == 20
    * 
    * @type: (Key*) -> (Val*) -> Mori.Hash_Map
    */
  var struct = function () {

    var keys = [].slice.call(arguments)

    //  define the constructor
    var ctor = function () {
      return M.zipmap(keys, [].slice.call(arguments))
    }

    //  build all the appropriate lenses
    keys.forEach(function (key) {
      ctor[key] = Lens.keyLens(key)
    })

    return ctor
  }

  return struct
})