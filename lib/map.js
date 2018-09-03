/**
 * Returns a simple map from a key to a list of values
 *
 * map.push('a', 1)
 * map.push('a', 2)
 * map.push('a', 2)
 * map.get('a') // [1, 2]
 */
exports.uniqueMap = () => {
  const map = {};

  return {
    push(key, value) {
      if (!map[key]) {
        map[key] = [];
      }
      if (!map[key].includes(value)) {
        map[key].push(value);
      }
    },
    get(key) {
      return map[key] || [];
    },
  };
}

/**
 * Map a set of 3 keys to a value
 */
exports.matrix3D = () => {
  const map = {};

  return {
    insert(x, y, z, value) {
      map[x] = map[x] || {};
      map[x][y] = map[x][y] || {};
      map[x][y][z] = value;
    },
    get(x, y, z, defaultValue) {
      if (!Reflect.has(map, x)) return defaultValue;
      if (!Reflect.has(map[x], y)) return defaultValue;
      if (!Reflect.has(map[x][y], z)) return defaultValue;
      return map[x][y][z];
    },
  };
}
