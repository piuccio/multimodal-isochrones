/**
 * Returns a list of objects with unique key.
 * In case of duplicates, it'll keep the one the minimises the minKey
 *
 * list.push({ key: 1, cost: 10 })
 * list.push({ key: 1, cost: 5 })
 * list.get() // [{ key: 1, cost: 5 }]
 */
exports.minUniqueList = (key, minKey) => {
  const list = [];
  // keep the min map for easy acces
  const minMap = {};
  return {
    push(obj) {
      if (obj[key] in minMap) {
        // duplicate
        const existingInfo = minMap[obj[key]];
        if (existingInfo.value > obj[minKey]) {
          // the one we have has an higher value, replace
          list[existingInfo.index] = obj;
          existingInfo.value = obj[minKey];
        }
        // else ignore this value, too high
      } else {
        minMap[obj[key]] = {
          index: list.length,
          value: obj[minKey],
        };
        list.push(obj);
      }
    },
    get() {
      return list;
    },
    map: Array.prototype.map.bind(list),
    reduce: Array.prototype.reduce.bind(list),
  };
}
