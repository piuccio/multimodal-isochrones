//@flow
/*::
interface MemoizedGraphs {
  addNode(line: string, node: string): void;
  addEdge(edge: Edge): void;
  distance(line: string, from: string, to: string): number;
}
*/
const floydWarshall = require('./algorithm/floyd-warshall');

/**
 * Store a list of graphs by line id, it'll only compute the distances once per line
 */
exports.memoizedGraphs = ()/*: MemoizedGraphs */ => {
  const graphs = {};

  return {
    addNode(line, node) {
      if (!graphs[line]) {
        graphs[line] = {
          nodes: [],
          nodesToPosition: {},
          edges: [],
          distance: null,
        };
      }
      const graph = graphs[line];
      if (!graph.nodes.includes(node)) {
        graph.nodesToPosition[node] = graph.nodes.push(node) - 1;
      }
    },
    addEdge(edge) {
      graphs[edge.line].edges.push(edge);
    },
    distance(line, from, to) {
      const distance = graphs[line].distance || floydWarshall(graphs[line].nodes, graphs[line].edges, graphs[line].nodesToPosition);
      graphs[line].distance = distance;
      return distance(from, to);
    },
  };
}
