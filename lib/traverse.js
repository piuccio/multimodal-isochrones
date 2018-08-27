//@ flow
exports.traversableGraph = () => {
  const pendingVisit = [];
  const alreadyVisited = [];

  const graphInterface = {
    insert(node, line, time = 0, lines = []) {
      pendingVisit.push({ node, line, time, lines });
      return graphInterface;
    },
    batch(fn) {
      const current = pendingVisit.slice();
      pendingVisit.length = 0;
      current.forEach((element) => {
        const elKey = `${element.node}_${element.line}`;
        if (!alreadyVisited.includes(elKey)) {
          // Include the current line in the visiting element
          fn(element);
        }
        alreadyVisited.push(elKey);
      });
    },
    empty() {
      return pendingVisit.length === 0;
    },
  };

  return graphInterface;
};
