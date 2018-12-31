// @flow
/**
 * Keep the list of paths that match the constraints
 */
exports.minPathList = (from/*: string*/) => {
  // Index the map by node
  const map/*: {[string]: ReachableNode } */ = {};
  return {
    add(node/*: string */, time/*: number*/, lines/*: Array<string>*/, extra/*: Object */) {
      if (map[node]) {
        // There is already a path to this node, keep the shortest
        const existingTime = map[node].paths[0].time;
        if (time < existingTime) {
          map[node] = {
            node,
            paths: [Object.assign({}, extra, { from, time, lines })],
          };
        }
      } else {
        // This node is missing, create
        map[node] = {
          node,
          paths: [Object.assign({}, extra, { from, time, lines })],
        };
      }
    },
    get: () => map,
  };
}
