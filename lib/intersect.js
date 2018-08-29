//@flow
const { findInAll } = require('./list');

module.exports = function (listOfReachableNodes/*: Array<Array<ReachableNode>> */) {
  return {
    get() {
      const [first, ...rest] = listOfReachableNodes;
      return first.map((element) => {
        const paths = findInAll('node', element.node, rest);
        if (!paths) return paths;

        return {
          node: element.node,
          paths: element.paths.concat(...paths.map((_) => _.paths)),
        };
      }).filter(Boolean);
    }
  };
}
