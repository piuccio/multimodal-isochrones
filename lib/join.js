// @flow
module.exports = (listOfReachableNodes/*: Array<{ [string]: ReachableNode }> */) => {
  const facade = {
    get()/*: Array<ReachableNode> */ {
      // $FlowFixMe
      return Object.values(facade.getAsMap());
    },
    getAsMap() {
      const combined = listOfReachableNodes[0];
      for (let i = 1, len = listOfReachableNodes.length; i < len; i += 1) {
        Object.keys(listOfReachableNodes[i]).forEach((key) => {
          const alternative = listOfReachableNodes[i][key];
          if (!combined[key] || minOfPaths(combined[key].paths) > minOfPaths(alternative.paths)) {
            // This node is not reachable from the other origin, add
            combined[key] = alternative;
          }
        });
      }
      return combined;
    }
  };
  return facade;
}

const minOfPaths = (paths) => Math.min(...paths.map((path) => path.time));
