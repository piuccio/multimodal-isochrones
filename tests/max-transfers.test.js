const iso = require('../index');
const { compare } = require('./assert');

describe('max-transfer filter', () => {
  it('returns a subset of results within a certain number of line transfers', () => {
    const graph = iso()
      .addNode('a1')
      .addNode('a2')
      .addNode('a3')
      .addEdge({ from: 'a1', to: 'a2', time: 4, line: 'a' })
      .addEdge({ from: 'a2', to: 'a3', time: 4, line: 'a' })
      .addNode('b2')
      .addNode('b3')
      .addEdge({ from: 'a3', to: 'b2', time: 3, line: 'b' })
      .addEdge({ from: 'b2', to: 'b3', time: 3, line: 'b' })
      .addNode('c2')
      .addNode('c3')
      .addEdge({ from: 'b3', to: 'c2', time: 5, line: 'c' })
      .addEdge({ from: 'c2', to: 'c3', time: 5, line: 'c' })
      .addNode('d2')
      .addNode('d3')
      .addEdge({ from: 'c3', to: 'd2', time: 2, line: 'd' })
      .addEdge({ from: 'd2', to: 'd3', time: 2, line: 'd' })
      // also add another line from `a1`, both results should be included
      .addNode('fast-a2')
      .addNode('fast-a3')
      .addEdge({ from: 'a1', to: 'fast-a2', time: 1, line: 'fast-a' })
      .addEdge({ from: 'fast-a2', to: 'fast-a3', time: 1, line: 'fast-a' })
      .addNode('fast-b2')
      .addNode('fast-b3')
      .addEdge({ from: 'fast-a3', to: 'fast-b2', time: 2, line: 'fast-b' })
      .addEdge({ from: 'fast-b2', to: 'fast-b3', time: 2, line: 'fast-b' })
      ;
    const expected = [
      { node: 'fast-a2', paths: [{ from: 'a1', lines: ['fast-a'], time: 1 }] },
      { node: 'fast-a3', paths: [{ from: 'a1', lines: ['fast-a'], time: 2 }] },
      { node: 'a2', paths: [{ from: 'a1', lines: ['a'], time: 4 }] },
      { node: 'a3', paths: [{ from: 'a1', lines: ['a'], time: 8 }] },
      { node: 'fast-b2', paths: [{ from: 'a1', lines: ['fast-a', 'fast-b'], time: 4 }] },
      { node: 'fast-b3', paths: [{ from: 'a1', lines: ['fast-a', 'fast-b'], time: 6 }] },
      { node: 'b2', paths: [{ from: 'a1', lines: ['a', 'b'], time: 11 }] },
      { node: 'b3', paths: [{ from: 'a1', lines: ['a', 'b'], time: 14 }] },
      { node: 'c2', paths: [{ from: 'a1', lines: ['a', 'b', 'c'], time: 19 }] },
      { node: 'c3', paths: [{ from: 'a1', lines: ['a', 'b', 'c'], time: 24 }] },
      { node: 'd2', paths: [{ from: 'a1', lines: ['a', 'b', 'c', 'd'], time: 26 }] },
      { node: 'd3', paths: [{ from: 'a1', lines: ['a', 'b', 'c', 'd'], time: 28 }] },
    ];
    const actual = graph.from('a1').get();
    const convenient = graph.from('a1').maxLines(2).get();
    const distant = graph.from('a1').maxLines(3).maxTime(20).get();
    compare(actual, expected);
    compare(convenient, expected.slice(0, 8));
    compare(distant, expected.slice(0, 9));
  });
});
