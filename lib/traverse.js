//@flow
/*::
interface TraverseGraph {
  insert(node: string, line: string, time: number, lines: Array<string>): TraverseGraph;
  batch(fn: (element: GraphElement) => void): void;
  empty(): boolean;
}
interface GraphElement {
  node: string;
  line: string;
  time: number;
  lines: Array<string>;
}
*/

exports.traversableGraph = () => {
  const pendingVisit/*: Array<GraphElement> */ = [];
  const alreadyVisited/*: { [string]: number } */ = {};

  const graphInterface/*: TraverseGraph */ = {
    insert(node, line, time = 0, lines = []) {
      pendingVisit.push({ node, line, time, lines });
      return graphInterface;
    },
    batch(fn) {
      const current = pendingVisit.slice();
      pendingVisit.length = 0;
      current.forEach((element) => {
        const elKey = `${element.node}_${element.line}`;
        if (!alreadyVisited[elKey] || alreadyVisited[elKey] > element.time) {
          // Include the current line in the visiting element
          fn(element);
        }
        alreadyVisited[elKey] = element.time;
      });
    },
    empty() {
      return pendingVisit.length === 0;
    },
  };

  return graphInterface;
};
