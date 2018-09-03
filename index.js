//@flow
const { graphCreator } = require('./lib/graph');
const intersect = require('./lib/intersect');

function createGraph()/*: GraphInterface */ {
  const nodes = [];
  const graphs = graphCreator();

  const facade = {
    addNode(node) {
      nodes.push(node);
      return facade;
    },
    addEdge(edge) {
      if (!nodes.includes(edge.from)) throw new Error(`Missing 'from' node ${edge.from}`);
      if (!nodes.includes(edge.to)) throw new Error(`Missing 'to' node ${edge.to}`);
      graphs.add(edge);
      return facade;
    },
    addConnection(station, line1, line2, time) {
      graphs.connection(station, line1, line2, time);
      return facade;
    },
    from: (node) => query(nodes, graphs, node),
    intersect: (...queries) => intersect(queries.map((_) => _.get())),
  };

  return facade;
}

function query(nodes, graphs, fromNode) {
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
      return graphs.get(fromNode, maxTime, maxLines);
    }
  };

  return facade;
}

module.exports = createGraph;
