const iso = require('../index');
const { compare } = require('./assert');

describe('max-time filter', () => {
  it('returns a subset of the results within the time constraints', () => {
    const graph = iso()
      .addEdge({ from: 'a1', to: 'transfer', time: 3, line: 'a' })
      .addEdge({ from: 'transfer', to: 'a3', time: 2, line: 'a' })
      .addEdge({ from: 'a3', to: 'a4', time: 2, line: 'a' })
      .addEdge({ from: 'a4', to: 'a5', time: 3, line: 'a' })

      .addEdge({ from: 'b1', to: 'transfer', time: 4, line: 'b' })
      .addEdge({ from: 'transfer', to: 'b3', time: 5, line: 'b' })
      .addEdge({ from: 'b3', to: 'second-transfer', time: 4, line: 'b' })
      .addEdge({ from: 'second-transfer', to: 'b5', time: 5, line: 'b' })

      .addEdge({ from: 'second-transfer', to: 'c2', time: 1, line: 'c' })
      .addEdge({ from: 'c2', to: 'c3', time: 2, line: 'c' })
      ;
    const expected = [
      { node: 'a1', paths: [{ from: 'a1', lines: [], time: 0 }] },
      { node: 'transfer', paths: [{ from: 'a1', lines: ['a'], time: 3 }] },
      { node: 'a3', paths: [{ from: 'a1', lines: ['a'], time: 5 }] },
      { node: 'a4', paths: [{ from: 'a1', lines: ['a'], time: 7 }] },
      { node: 'a5', paths: [{ from: 'a1', lines: ['a'], time: 10 }] },
      { node: 'b1', paths: [{ from: 'a1', lines: ['a', 'b'], time: 7 }] },
      { node: 'b3', paths: [{ from: 'a1', lines: ['a', 'b'], time: 8 }] },
      { node: 'second-transfer', paths: [{ from: 'a1', lines: ['a', 'b'], time: 12 }] },
      { node: 'b5', paths: [{ from: 'a1', lines: ['a', 'b'], time: 17 }] },
      { node: 'c2', paths: [{ from: 'a1', lines: ['a', 'b', 'c'], time: 13 }] },
      { node: 'c3', paths: [{ from: 'a1', lines: ['a', 'b', 'c'], time: 15 }] },
    ];
    const nearby = graph.from('a1').maxTime(5).get();
    const faraway = graph.from('a1').maxTime(10).get();
    compare(nearby, expected.slice(0, 3));
    compare(faraway, expected.slice(0, 7));
  });
});
