const iso = require('../index');
const { compare } = require('./assert');

describe('intersect nodes', () => {
  it('returns only nodes that are reachable by both origins', () => {
    const graph = iso()
      .addEdge({ from: '1', to: '2', time: 2, line: 'a' })
      .addEdge({ from: '2', to: '3', time: 3, line: 'a' })
      .addEdge({ from: '3', to: '4', time: 2, line: 'a' })
      .addEdge({ from: '4', to: '5', time: 3, line: 'a' })

      .addEdge({ from: '10', to: '11', time: 4, line: 'b' })
      .addEdge({ from: '11', to: '12', time: 6, line: 'b' })
      .addEdge({ from: '12', to: '13', time: 4, line: 'b' })
      .addEdge({ from: '13', to: '14', time: 6, line: 'b' })

      .addEdge({ from: 'a', to: '2', time: 3, line: 'c' })
      .addEdge({ from: '2', to: '11', time: 7, line: 'c' })
      .addEdge({ from: '11', to: 'b', time: 3, line: 'c' })
      .addEdge({ from: 'b', to: 'c', time: 3, line: 'c' })
      .addEdge({ from: 'c', to: '14', time: 1, line: 'c' })
      ;
    const expected = [
      { node: '1', paths: [
        { from: '1', lines: [], time: 0 },
      ]},
      { node: '2', paths: [
        { from: '1', lines: ['a'], time: 2 },
      ]},
      { node: '3', paths: [
        { from: '1', lines: ['a'], time: 5 },
      ]},
      { node: '4', paths: [
        { from: '1', lines: ['a'], time: 7 },
      ]},
      { node: '5', paths: [
        { from: '1', lines: ['a'], time: 10 },
      ]},
      { node: '10', paths: [
        { from: '10', lines: [], time: 0 },
      ]},
      { node: '11', paths: [
        { from: '10', lines: ['b'], time: 4 },
      ]},
      { node: '12', paths: [
        { from: '10', lines: ['b'], time: 10 },
      ]},
      { node: '13', paths: [
        { from: '10', lines: ['b'], time: 14 },
      ]},
      { node: '14', paths: [
        { from: '10', lines: ['b', 'c'], time: 11 },
      ]},
      { node: 'a', paths: [
        { from: '1', lines: ['a', 'c'], time: 5 },
      ]},
      { node: 'b', paths: [
        { from: '10', lines: ['b', 'c'], time: 7 },
      ]},
      { node: 'c', paths: [
        { from: '10', lines: ['b', 'c'], time: 10 },
      ]},
    ];
    const join = graph.join(
      graph.from('1'),
      graph.from('10'),
    ).get();
    compare(join, expected);
  });
});
