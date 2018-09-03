/* eslint-disable no-console */
// Generate a random graph
const fs = require('fs');
const path = require('path');

const NUMBER_LINES = 600;
const NUMBER_NODES = 2000;
const MAX_NODES_ON_LINE = 30;
const MAX_TIME_BETWEEN_NODES = 15;

const json = {
  nodes: [],
  edges: [],
};
for (let i = 0; i < NUMBER_NODES; i += 1) {
  json.nodes.push(`node_${i}`);
}
for (let i = 0; i < NUMBER_LINES; i += 1) {
  const edges = [];
  const nodesCount = Math.floor(2 + Math.random() * MAX_NODES_ON_LINE);
  for (let j = 0; j <= nodesCount; j += 1) {
    const from = `node_${Math.floor(Math.random() * NUMBER_NODES)}`;
    const to = `node_${Math.floor(Math.random() * NUMBER_NODES)}`;
    const line = `line_${i}`;
    const edgeId = [from, to, line].join('_');
    if (edges.includes(edgeId)) {
      i -= 1;
      continue;
    }
    edges.push(edgeId);
    json.edges.push({ from, to, time: Math.floor(1 + Math.random() * MAX_TIME_BETWEEN_NODES), line: line });
  }
}

fs.writeFileSync(path.join(__dirname, './graph.json'), JSON.stringify(json, null, '  '));
console.log(`Generated a graph with ${json.nodes.length} nodes and ${json.edges.length} edges`);
