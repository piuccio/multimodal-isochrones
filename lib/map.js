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
