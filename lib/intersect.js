// @flow
module.exports = function (listOfReachableNodes/*: Array<{ [string]: ReachableNode }> */) {
  const facade = {
    get()/*: Array<ReachableNode> */ {
      // $FlowFixMe
      return Object.values(facade.getAsMap());
    },
    getAsMap() {
      const combined = listOfReachableNodes[0];
      for (let i = 1, len = listOfReachableNodes.length; i < len; i += 1) {
        Object.keys(combined).forEach((key) => {
          const additional = listOfReachableNodes[i];
          if (!additional[key]) {
            // This node does not exist in one of the paths, remove
            delete combined[key];
          } else {
            combined[key].paths.push(...additional[key].paths);
          }
        });
      }
      return combined;
    }
  };
  return facade;
}
