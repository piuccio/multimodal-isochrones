const iso = require('../index');
const { compare } = require('./assert');

describe('transfer lines', () => {
  it('allows to transfer lines with missing transfer cost', () => {
    const graph = iso()
      .addNode('a1')
      .addNode('transfer')
      .addNode('a3')
      .addNode('a4')
      .addNode('a5')
      .addEdge({ from: 'a1', to: 'transfer', time: 3, line: 'a' })
      .addEdge({ from: 'transfer', to: 'a3', time: 2, line: 'a' })
      .addEdge({ from: 'a3', to: 'a4', time: 2, line: 'a' })
      .addEdge({ from: 'a4', to: 'a5', time: 3, line: 'a' })
      .addNode('b1')
      .addNode('transfer')
      .addNode('b3')
      .addNode('second-transfer')
      .addNode('b5')
      .addEdge({ from: 'b1', to: 'transfer', time: 4, line: 'b' })
      .addEdge({ from: 'transfer', to: 'b3', time: 5, line: 'b' })
      .addEdge({ from: 'b3', to: 'second-transfer', time: 4, line: 'b' })
      .addEdge({ from: 'second-transfer', to: 'b5', time: 5, line: 'b' })
      .addNode('second-transfer')
      .addNode('c2')
      .addNode('c3')
      .addEdge({ from: 'second-transfer', to: 'c2', time: 1, line: 'c' })
      .addEdge({ from: 'c2', to: 'c3', time: 2, line: 'c' })
      ;
    const expected = [
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
    const actual = graph.from('a1').get();
    compare(actual, expected);
  });

  it('handles lines with hops', () => {
    const graph = iso()
      .addNode('node1')
      .addNode('node2')
      .addNode('node3')
      .addNode('node4')
      .addNode('node5')
      .addEdge({ from: 'node1', to: 'node2', time: 4, line: 'slow' })
      .addEdge({ from: 'node2', to: 'node3', time: 4, line: 'slow' })
      .addEdge({ from: 'node3', to: 'node4', time: 4, line: 'slow' })
      .addEdge({ from: 'node4', to: 'node5', time: 4, line: 'slow' })
      // the fast line skips some stations
      .addEdge({ from: 'node2', to: 'node4', time: 6, line: 'fast' })
    ;
    const expected = [
      { node: 'node2', paths: [{ from: 'node1', lines: ['slow'], time: 4 }] },
      { node: 'node3', paths: [{ from: 'node1', lines: ['slow'], time: 8 }] },
      { node: 'node4', paths: [{ from: 'node1', lines: ['slow', 'fast'], time: 10 }] },
      { node: 'node5', paths: [{ from: 'node1', lines: ['slow', 'fast', 'slow'], time: 14 }] },
    ]
    const actual = graph.from('node1').get();
    compare(actual, expected);
  });
});
