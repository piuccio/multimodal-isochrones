const iso = require('../index');
const { compare } = require('./assert');

describe('single line', () => {
  it('takes into account the time to change line', () => {
    const graph = iso()
      .addNode('1')
      .addNode('2')
      .addNode('3')
      .addNode('4')
      .addNode('5')
      .addEdge({ from: '1', to: '2', time: 1, line: 'l1' })
      .addEdge({ from: '2', to: '3', time: 2, line: 'l1' })
      .addEdge({ from: '3', to: '4', time: 5, line: 'l1' })
      .addEdge({ from: '4', to: '5', time: 12, line: 'l1' })
      .addNode('fast-a')
      .addNode('fast-b')
      .addNode('fast-c')
      .addEdge({ from: '3', to: 'fast-a', time: 3, line: 'l2' })
      .addEdge({ from: 'fast-a', to: 'fast-b', time: 2, line: 'l2' })
      .addEdge({ from: 'fast-b', to: 'fast-c', time: 3, line: 'l2' })
      .addNode('a')
      .addNode('b')
      .addEdge({ from: 'fast-c', to: 'a', time: 1, line: 'l3' })
      .addEdge({ from: 'a', to: 'b', time: 2, line: 'l3' })
      .addEdge({ from: 'b', to: '5', time: 1, line: 'l3' })
      .addConnection('3', 'l1', 'l2', 2)
      .addConnection('fast-c', 'l2', 'l3', 2)
      ;
    // It should be faster to transfer line unless we count the transfer time
    const expected = [
      { node: '1', paths: [{ from: '1', lines: [], time: 0 }] },
      { node: '2', paths: [{ from: '1', lines: ['l1'], time: 1 }] },
      { node: '3', paths: [{ from: '1', lines: ['l1'], time: 3 }] },
      { node: '4', paths: [{ from: '1', lines: ['l1'], time: 8 }] },
      // { node: '5', paths: [{ from: '1', lines: ['l1'], time: 20 }] }, direct line
      { node: 'fast-a', paths: [{ from: '1', lines: ['l1', 'l2'], time: 8 }] },
      { node: 'fast-b', paths: [{ from: '1', lines: ['l1', 'l2'], time: 10 }] },
      { node: 'fast-c', paths: [{ from: '1', lines: ['l1', 'l2'], time: 13 }] },
      { node: 'a', paths: [{ from: '1', lines: ['l1', 'l2', 'l3'], time: 16 }] },
      { node: 'b', paths: [{ from: '1', lines: ['l1', 'l2', 'l3'], time: 18 }] },
      { node: '5', paths: [{ from: '1', lines: ['l1', 'l2', 'l3'], time: 19 }] }, // transfer
    ];
    const actual = graph.from('1').get();
    compare(actual, expected);
  });

  it('uses a default time to transfer', () => {
    const graph = iso({ defaultConnectionTime: 5 })
      .addNode('1')
      .addNode('2')
      .addNode('3')
      .addNode('4')
      .addNode('5')
      .addEdge({ from: '1', to: '2', time: 1, line: 'l1' })
      .addEdge({ from: '2', to: '3', time: 2, line: 'l1' })
      .addEdge({ from: '3', to: '4', time: 3, line: 'l1' })
      .addEdge({ from: '4', to: '5', time: 4, line: 'l1' })
      .addNode('a')
      .addNode('b')
      .addNode('c')
      .addEdge({ from: '3', to: 'a', time: 3, line: 'l2' })
      .addEdge({ from: 'a', to: 'b', time: 2, line: 'l2' })
      .addEdge({ from: 'b', to: 'c', time: 1, line: 'l2' })
      ;
    // It should be faster to transfer line unless we count the transfer time
    const expected = [
      { node: '1', paths: [{ from: '1', lines: [], time: 0 }] },
      { node: '2', paths: [{ from: '1', lines: ['l1'], time: 1 }] },
      { node: '3', paths: [{ from: '1', lines: ['l1'], time: 3 }] },
      { node: '4', paths: [{ from: '1', lines: ['l1'], time: 6 }] },
      { node: '5', paths: [{ from: '1', lines: ['l1'], time: 10 }] },
      { node: 'a', paths: [{ from: '1', lines: ['l1', 'l2'], time: 11 }] },
      { node: 'b', paths: [{ from: '1', lines: ['l1', 'l2'], time: 13 }] },
      { node: 'c', paths: [{ from: '1', lines: ['l1', 'l2'], time: 14 }] },
    ];
    const actual = graph.from('1').get();
    compare(actual, expected);
  });
});
