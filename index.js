//@flow
const { graphCreator } = require('./lib/graph');

function createGraph()/*: GraphInterface */ {
  const nodes = [];
  const graphs = graphCreator();

  const facade = {
    addNode: (node) => {
      nodes.push(node);
      return facade;
    },
    addEdge: (edge) => {
      if (!nodes.includes(edge.from)) throw new Error(`Missing 'from' node ${edge.from}`);
      if (!nodes.includes(edge.to)) throw new Error(`Missing 'to' node ${edge.to}`);
      graphs.add(edge);
      return facade;
    },
    from: (node) => query(nodes, graphs, node),
  };

  return facade;
}

function query(nodes, graphs, fromNode) {
  let maxTime = Infinity;

  const facade = {
    maxTime(max) {
      maxTime = max;
      return facade;
    },
    get: () => {
      return graphs.get(fromNode, maxTime);
    }
  };

  return facade;
}

module.exports = createGraph;
