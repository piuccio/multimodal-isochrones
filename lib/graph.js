//@flow
const cytoscape = require('cytoscape');
const { uniqueMap } = require('./map');
const { minUniqueList } = require('./list');
const { traversableGraph } = require('./traverse');

const MAX_TRANSFERS = 10;

exports.graphCreator = () => {
  const graphs = {};
  const mapNodeToLines = uniqueMap();
  const mapLineToNodes = uniqueMap();

  return {
    add: (edge/*: Edge */) => {
      // Generate the graph if missing
      if (!graphs[edge.line]) {
        graphs[edge.line] = {
          cy: new cytoscape(),
          nodes: [],
        };
      }
      const graph = graphs[edge.line];
      // Add the from node
      if (!graph.nodes.includes(edge.from)) {
        graph.nodes.push(edge.from);
        graph.cy.add(cyNode(edge.line, edge.from));
        mapNodeToLines.push(edge.from, edge.line);
        mapLineToNodes.push(edge.line, edge.from);
      }
      // Add the to node
      if (!graph.nodes.includes(edge.to)) {
        graph.nodes.push(edge.to);
        graph.cy.add(cyNode(edge.line, edge.to));
        mapNodeToLines.push(edge.to, edge.line);
        mapLineToNodes.push(edge.line, edge.to);
      }
      // Add the edge
      graph.cy.add(cyEdge(edge));
    },
    get: (from/*: string */) => {
      const paths = minUniqueList('node', 'time');
      const traverse = traversableGraph();
      mapNodeToLines.get(from).forEach((line) => {
        traverse.insert(from, line);
      });
      let iterations = 0;
      while (!traverse.empty() && iterations < MAX_TRANSFERS) {
        iterations += 1;
        traverse.batch((el) => {
          const { distance } = graphs[el.line].cy.elements().floydWarshall(timeWeight);
          // Iterate over all nodes on the same line
          mapLineToNodes.get(el.line).forEach((to) => {
            if (to === el.node || to === from) return;
            const time = distance({ id: () => nodeId(el.line, el.node) }, { id: () => nodeId(el.line, to) });
            const traversedLines = el.lines.concat(el.line);
            const totalTime = el.time + time;
            paths.push({ node: to, time: totalTime, lines: traversedLines });
            // Remeber that we want to iterate on all transfer nodes
            mapNodeToLines.get(to).forEach((transferLine) => {
              // Only iterate on other lines, we've already computed distances on this line
              if (transferLine !== el.line) traverse.insert(to, transferLine, totalTime, traversedLines);
            });
          });
        });
      }
      return paths.map((path) => ({
        node: path.node,
        paths: [{
          from,
          lines: path.lines,
          time: path.time,
        }],
      }));
    }
  };
};

const nodeId = (line, node) => `${line}_${node}`;

function cyNode(line, node) {
  return { group: 'nodes', data: { id: nodeId(line, node) } };
}

function cyEdge(edge) {
  const { line, from, to, time } = edge;
  return {
    groups: 'edges',
    data: {
      id: `${line}_${from}_${to}`,
      source: nodeId(line, from),
      target: nodeId(line, to),
      time,
      edge,
    },
  };
}

const timeWeight = {
  weight: (edge) => edge.data().time,
};
