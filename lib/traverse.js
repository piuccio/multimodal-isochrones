//@flow
/*::
interface TraverseGraph {
  insert(node: string, line: string, time: number, lines: Array<string>): TraverseGraph;
  visit(node: string, line: string, time: number): void;
  batch(fn: (element: GraphElement) => void): void;
  empty(): boolean;
}
interface GraphElement {
  key: string;
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
      const key = `${node}_${line}`;
      pendingVisit.push({ key, node, line, time, lines });
      return graphInterface;
    },
    visit(node, line, time) {
      // mark a node as already visited
      const key = `${node}_${line}`;
      alreadyVisited[key] = Math.min(time, alreadyVisited[key] || Infinity);
    },
    batch(fn) {
      const current = pendingVisit.slice();
      pendingVisit.length = 0;
      current.forEach((element) => {
        const elKey = element.key;
        if (!alreadyVisited[elKey] || alreadyVisited[elKey] > element.time) {
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
