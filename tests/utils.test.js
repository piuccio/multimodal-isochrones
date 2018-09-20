const iso = require('../index');

describe('getTraversedLines', () => {
  it('returns all lines traversed by a simple graph search', () => {
    const graph = iso()
      .addEdge({ from: 'a1', to: 'a2', time: 5, line: 'a' })
      .addEdge({ from: 'a2', to: 'a3', time: 5, line: 'a' })
      .addEdge({ from: 'a3', to: 'a4', time: 5, line: 'a' })
      .addEdge({ from: 'a4', to: 'a5', time: 5, line: 'a' })

      .addEdge({ from: 'b1', to: 'a2', time: 10, line: 'b' })
      .addEdge({ from: 'a2', to: 'b3', time: 10, line: 'b' })
      .addEdge({ from: 'b3', to: 'b4', time: 10, line: 'b' })
      .addEdge({ from: 'b4', to: 'b5', time: 10, line: 'b' })
      ;

    const near = graph.from('a1').maxTime(10).get();
    const all = graph.from('a1').get();

    expect(iso.getTraversedLines(near).sort()).toEqual(['a']);
    expect(iso.getTraversedLines(all).sort()).toEqual(['a', 'b']);
  });

  it('returns all lines traversed by an intersection of results', () => {
    const graph = iso()
      .addEdge({ from: 'a1', to: 'a2', time: 5, line: 'a' })
      .addEdge({ from: 'a2', to: 'a3', time: 5, line: 'a' })
      .addEdge({ from: 'a3', to: 'a4', time: 5, line: 'a' })
      .addEdge({ from: 'a4', to: 'a5', time: 5, line: 'a' })

      .addEdge({ from: 'b1', to: 'a2', time: 10, line: 'b' })
      .addEdge({ from: 'a2', to: 'b3', time: 10, line: 'b' })
      .addEdge({ from: 'b3', to: 'b4', time: 10, line: 'b' })
      .addEdge({ from: 'b4', to: 'b5', time: 10, line: 'b' })
      ;

    const fromA = graph.from('a1').maxTime(10);
    const fromB = graph.from('b1').maxTime(10);
    const result = graph.intersect(fromA, fromB).get();

    // The result only contains a2, but since we come from b1 all lines should be present
    expect(iso.getTraversedLines(result).sort()).toEqual(['a', 'b']);
  });
});
