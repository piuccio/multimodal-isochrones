const iso = require('../index');
const { compare } = require('./assert');

describe('single line', () => {
  it('computes the travel distance on a single line', () => {
    const graph = iso()
      .addNode('1')
      .addNode('2')
      .addNode('3')
      .addNode('4')
      .addNode('5')
      .addEdge({ from: '1', to: '2', time: 1, line: 'l1' })
      .addEdge({ from: '2', to: '3', time: 2, line: 'l1' })
      .addEdge({ from: '3', to: '4', time: 3, line: 'l1' })
      .addEdge({ from: '4', to: '5', time: 1, line: 'l1' })
      .addEdge({ from: '5', to: '2', time: 8, line: 'l1' }) // loop
      ;
    const expected = [
      { node: '1', paths: [{ from: '2', lines: ['l1'], time: 1 }] },
      { node: '3', paths: [{ from: '2', lines: ['l1'], time: 2 }] },
      { node: '4', paths: [{ from: '2', lines: ['l1'], time: 5 }] },
      { node: '5', paths: [{ from: '2', lines: ['l1'], time: 6 }] },
    ];
    const actual = graph.from('2').get();
    compare(actual, expected);
  });

  it('manages nodes with multiple lines on the origin', () => {
    const graph = iso()
      .addNode('root')
      .addNode('a2')
      .addNode('a3')
      .addNode('a4')
      .addEdge({ from: 'root', to: 'a2', time: 2, line: 'a' })
      .addEdge({ from: 'a2', to: 'a3', time: 3, line: 'a' })
      .addEdge({ from: 'a3', to: 'a4', time: 2, line: 'a' })
      .addNode('b2')
      .addNode('b3')
      .addNode('b4')
      .addEdge({ from: 'root', to: 'b2', time: 3, line: 'b' })
      .addEdge({ from: 'b2', to: 'b3', time: 2, line: 'b' })
      .addEdge({ from: 'b3', to: 'b4', time: 4, line: 'b' })
      ;
    const expected = [
      { node: 'a2', paths: [{ from: 'root', lines: ['a'], time: 2 }] },
      { node: 'a3', paths: [{ from: 'root', lines: ['a'], time: 5 }] },
      { node: 'a4', paths: [{ from: 'root', lines: ['a'], time: 7 }] },
      { node: 'b2', paths: [{ from: 'root', lines: ['b'], time: 3 }] },
      { node: 'b3', paths: [{ from: 'root', lines: ['b'], time: 5 }] },
      { node: 'b4', paths: [{ from: 'root', lines: ['b'], time: 9 }] },
    ];
    const actual = graph.from('root').get();
    compare(actual, expected);
  });
});
