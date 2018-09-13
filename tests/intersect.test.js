const iso = require('../index');
const { compare } = require('./assert');

describe('intersect nodes', () => {
  it('returns only nodes that are reachable by both origins', () => {
    const graph = iso()
      .addEdge({ from: 'a1', to: 'a2', time: 4, line: 'a' })
      .addEdge({ from: 'a2', to: 'connect', time: 4, line: 'a' })
      .addEdge({ from: 'connect', to: 'a4', time: 4, line: 'a' })
      .addEdge({ from: 'a4', to: 'a5', time: 4, line: 'a' })

      .addEdge({ from: 'b1', to: 'b2', time: 3, line: 'b' })
      .addEdge({ from: 'b2', to: 'connect', time: 3, line: 'b' })
      .addEdge({ from: 'connect', to: 'b4', time: 3, line: 'b' })
      .addEdge({ from: 'b4', to: 'b5', time: 3, line: 'b' })
      ;
    const expected = [
      { node: 'a2', paths: [
        { from: 'a1', lines: ['a'], time: 4 },
        { from: 'b5', lines: ['b', 'a'], time: 10 },
      ]},
      { node: 'connect', paths: [
        { from: 'a1', lines: ['a'], time: 8 },
        { from: 'b5', lines: ['b'], time: 6 },
      ]},
      // a bit further away
      { node: 'a4', paths: [
        { from: 'a1', lines: ['a'], time: 12 },
        { from: 'b5', lines: ['b', 'a'], time: 10 },
      ]},
      { node: 'b4', paths: [
        { from: 'a1', lines: ['a', 'b'], time: 11 },
        { from: 'b5', lines: ['b'], time: 3 },
      ]},
      { node: 'b2', paths: [
        { from: 'a1', lines: ['a', 'b'], time: 11 },
        { from: 'b5', lines: ['b'], time: 9 },
      ]},
      // all the rest
      { node: 'a5', paths: [
        { from: 'a1', lines: ['a'], time: 16 },
        { from: 'b5', lines: ['b', 'a'], time: 14 },
      ]},
      { node: 'a1', paths: [
        { from: 'a1', lines: [], time: 0 },
        { from: 'b5', lines: ['b', 'a'], time: 14 },
      ]},
      { node: 'b1', paths: [
        { from: 'a1', lines: ['a', 'b'], time: 14 },
        { from: 'b5', lines: ['b'], time: 12 },
      ]},
      { node: 'b5', paths: [
        { from: 'a1', lines: ['a', 'b'], time: 14 },
        { from: 'b5', lines: [], time: 0 },
      ]},
    ];
    const all = graph.intersect(
      graph.from('a1'),
      graph.from('b5'),
    ).get();
    const near = graph.intersect(
      graph.from('a1').maxTime(10),
      graph.from('b5').maxTime(10),
    ).get();
    const distant = graph.intersect(
      graph.from('a1').maxTime(12),
      graph.from('b5').maxTime(12),
    ).get();
    compare(all, expected);
    compare(near, expected.slice(0, 2));
    compare(distant, expected.slice(0, 5));
  });
});
