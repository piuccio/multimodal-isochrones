//@flow
/**
 * @license https://github.com/cytoscape/cytoscape.js/blob/master/LICENSE
 *
 * This code was extracted from https://github.com/cytoscape/cytoscape.js/blob/master/src/collection/algorithms/floyd-warshall.js
 * and modified to have faster lookups of nodes and edges, but the actual implementation was left intact except for the weight
 * functions which expects edges to already have a `time` property
 */

const defaultOptions/*: Options */ = {
  directed: false,
};
/*::
type NodesList = Array<string>;
type EdgesList = Array<Edge>;
type Options = {
  directed?: boolean,
}
type IdToPosition = { [string]: number }
*/

module.exports = (nodes/*: NodesList */, edges/*: EdgesList */, id2position/*: IdToPosition */, options/*: Options */ = defaultOptions) => {
  // directed - optional
  const directed = options.directed === true;

  const numNodes = nodes.length;

  // Initialize distance matrix
  const dist = [];

  for (let i = 0; i < numNodes; i++) {
    const newRow = new Array(numNodes);
    for (let j = 0; j < numNodes; j++) {
      if (i == j) {
        newRow[j] = 0;
      } else {
        newRow[j] = Infinity;
      }
    }
    dist.push(newRow);
  }

  // Process edges
  for (let i = 0; i < edges.length; i++) {
    const sourceIndex = id2position[edges[i].from];
    const targetIndex = id2position[edges[i].to];
    const weight = edges[i].time;

    // Check if already process another edge between same 2 nodes
    if (dist[sourceIndex][targetIndex] > weight) {
      dist[sourceIndex][targetIndex] = weight;
    }

    if (!directed) {
      // Check if already process another edge between same 2 nodes
      if (dist[targetIndex][sourceIndex] > weight) {
        dist[targetIndex][sourceIndex] = weight;
      }
    }
  }

  // Main loop
  for (let k = 0; k < numNodes; k++) {
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return (from/*: string */, to/*: string */) => dist[id2position[from]][id2position[to]];
}
