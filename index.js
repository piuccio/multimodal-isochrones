//@flow
const { graphCreator } = require('./lib/graph');
const intersect = require('./lib/intersect');
const join = require('./lib/join');

function createGraph(options/*: GraphOptions */ = {})/*: GraphInterface */ {
  const graphs = graphCreator();

  const facade = {
    addEdge(edge) {
      graphs.add(edge);
      return facade;
    },
    addConnection(station, line1, line2, time) {
      graphs.connection(station, line1, line2, time);
      return facade;
    },
    from: (node) => query(graphs, node, options),
    intersect: (...queries) => intersect(queries.map((_) => _.getAsMap())),
    join: (...queries) => join(queries.map((_) => _.getAsMap())),
  };

  // $FlowFixMe
  return facade;
}

function query(graphs, fromNode, options) {
  let maxTime = Infinity;
  let maxLines = Infinity;
  let pathData = {};

  const facade = {
    maxTime(max) {
      maxTime = max;
      return facade;
    },
    maxLines(max) {
      maxLines = max;
      return facade;
    },
    pathData: (extra) => {
      pathData = extra;
      return facade;
    },
    getAsMap: () => graphs.get(fromNode, maxTime, maxLines, pathData, options),
    get: () => Object.values(facade.getAsMap()),
  };

  return facade;
}

module.exports = createGraph;

// Utility methods
createGraph.getTraversedLines = (queryResult = []) => {
  const linesSet = queryResult.reduce((lines, result) => {
    result.paths.forEach((path) => path.lines.forEach((_) => lines.add(_)));
    return lines;
  }, new Set());
  return [...linesSet].filter(Boolean);
};
