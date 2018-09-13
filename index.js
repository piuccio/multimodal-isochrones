//@flow
const { graphCreator } = require('./lib/graph');
const intersect = require('./lib/intersect');

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
    intersect: (...queries) => intersect(queries.map((_) => _.get())),
  };

  return facade;
}

function query(graphs, fromNode, options) {
  let maxTime = Infinity;
  let maxLines = Infinity;

  const facade = {
    maxTime(max) {
      maxTime = max;
      return facade;
    },
    maxLines(max) {
      maxLines = max;
      return facade;
    },
    get: () => {
      return graphs.get(fromNode, maxTime, maxLines, options);
    }
  };

  return facade;
}

module.exports = createGraph;
