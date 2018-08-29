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
*/

module.exports = (nodes/*: NodesList */, edges/*: EdgesList */, options/*: Options */ = defaultOptions) => {
  // directed - optional
  const directed = options.directed === true;

  const numNodes = nodes.length;

  // mapping: node id -> position in nodes array
  const id2position/*: { [string]: number } */ = {};
  for (let i = 0; i < numNodes; i++) {
    id2position[nodes[i]] = i;
  }

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

  // Initialize matrix used for path reconstruction
  // Initialize distance matrix
  const next = [];
  const edgeNext = [];

  const initMatrix = function initMatrix(array) {
    for (let i = 0; i < numNodes; i++) {
      array.push([]);
    }
  };

  initMatrix(next);
  initMatrix(edgeNext);

  // Process edges
  for (let i = 0; i < edges.length; i++) {
    const sourceIndex = id2position[edges[i].from];
    const targetIndex = id2position[edges[i].to];
    const weight = edges[i].time;

    // Check if already process another edge between same 2 nodes
    if (dist[sourceIndex][targetIndex] > weight) {
      dist[sourceIndex][targetIndex] = weight;
      next[sourceIndex][targetIndex] = targetIndex;
      edgeNext[sourceIndex][targetIndex] = edges[i];
    }
  }

  // If undirected graph, process 'reversed' edges
  if (!directed) {
    for (let i = 0; i < edges.length; i++) {
      const sourceIndex = id2position[edges[i].to];
      const targetIndex = id2position[edges[i].from];
      const weight = edges[i].time;

      // Check if already process another edge between same 2 nodes
      if (dist[sourceIndex][targetIndex] > weight) {
        dist[sourceIndex][targetIndex] = weight;
        next[sourceIndex][targetIndex] = targetIndex;
        edgeNext[sourceIndex][targetIndex] = edges[i];
      }
    }
  }

  // Main loop
  for (let k = 0; k < numNodes; k++) {
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Build result object
  const position2id = [];
  for (let i = 0; i < numNodes; i++) {
    position2id.push(nodes[i]);
  }

  const res = {
    distance: (from/*: string */, to/*: string */) => dist[id2position[from]][id2position[to]],

    path: (from/*: string */, to/*: string */) => {
      if (from === to) {
        return from;
      }
      let fromIndex = id2position[from];
      let toIndex = id2position[to];
      if (next[fromIndex][toIndex] === undefined) {
        return undefined;
      }

      const path = [from];
      let prev = fromIndex;
      while (fromIndex !== toIndex) {
        prev = fromIndex;
        fromIndex = next[fromIndex][toIndex];

        const edge = edgeNext[prev][fromIndex];
        path.push(edge);

        path.push(position2id[fromIndex]);
      }
      return path;
    }
  };

  return res;
}
