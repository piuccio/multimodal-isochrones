//@flow
const { uniqueMap } = require('./map');
const { minUniqueList } = require('./list');
const { traversableGraph } = require('./traverse');
const { memoizedGraphs } = require('./memoized');

const SAFE_MAX_LINES = 20;

exports.graphCreator = () => {
  const graphs = memoizedGraphs();
  const mapNodeToLines = uniqueMap();
  const mapLineToNodes = uniqueMap();

  return {
    add: (edge/*: Edge */) => {
      // Add the from node
      graphs.addNode(edge.line, edge.from);
      mapNodeToLines.push(edge.from, edge.line);
      mapLineToNodes.push(edge.line, edge.from);
      // Add the to node
      graphs.addNode(edge.line, edge.to);
      mapNodeToLines.push(edge.to, edge.line);
      mapLineToNodes.push(edge.line, edge.to);
      // Add the edge
      graphs.addEdge(edge);
    },
    get: (from/*: string */, maxTime/*: number */, maxLines/*: number */) => {
      const paths = minUniqueList('node', 'time');
      const traverse = traversableGraph();
      mapNodeToLines.get(from).forEach((line) => {
        traverse.insert(from, line, 0, []);
      });
      paths.push({ node: from, time: 0, lines: [] });
      let iterations = 0;
      while (!traverse.empty() && iterations < Math.min(maxLines, SAFE_MAX_LINES)) {
        iterations += 1;
        traverse.batch((el) => {
          // Iterate over all nodes on the same line
          mapLineToNodes.get(el.line).forEach((to) => {
            if (to === el.node || to === from) return;
            const time = graphs.distance(el.line, el.node, to);
            const totalTime = el.time + time;
            if (totalTime <= maxTime) {
              const traversedLines = el.lines.concat(el.line);
              paths.push({ node: to, time: totalTime, lines: traversedLines });
              // Remeber that we want to iterate on all transfer nodes
              mapNodeToLines.get(to).forEach((transferLine) => {
                // Only iterate on other lines, we've already computed distances on this line
                if (transferLine !== el.line) {
                  traverse.insert(to, transferLine, totalTime, traversedLines);
                } else {
                  traverse.visit(to, transferLine, totalTime);
                }
              });
            }
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
