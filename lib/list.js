// @flow
/**
 * Keep the list of paths that match the constraints
 */
exports.minPathList = (from/*: string*/) => {
  // Index the map by node
  const map/*: {[string]: ReachableNode } */ = {};
  return {
    add(node/*: string */, time/*: number*/, lines/*: Array<string>*/) {
      if (map[node]) {
        // There is already a path to this node, keep the shortest
        const existingTime = map[node].paths[0].time;
        if (time < existingTime) {
          map[node] = {
            node,
            paths: [{ from, time, lines }],
          };
        }
      } else {
        // This node is missing, create
        map[node] = {
          node,
          paths: [{ from, time, lines }],
        };
      }
    },
    get: () => Object.values(map),
  };
}

/**
 * Find an object in an array of lists of objects.
 *
 * Every list in `array` must contain an element with `key` and `value`
 *
 * Returns a list of matching elements or null
 */
exports.findInAll = /*:: <T: {}>*/(key/*: string*/, value/*: string*/, array/*: Array<Array<T>>*/)/*: ?Array<T> */ => {
  const matching = array
    .map((list) => list.find((node) => node[key] === value))
    .filter(Boolean);

  return matching.length === array.length ? matching : null;
}
