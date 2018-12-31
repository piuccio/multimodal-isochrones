const iso = require('../index');
const { compare } = require('./assert');

describe('data', () => {
  it('attach extra data to any path', () => {
    const graph = iso()
      .addEdge({ from: '1', to: '2', time: 5, line: 'a' })
      .addEdge({ from: '2', to: '3', time: 5, line: 'a' })
      .addEdge({ from: '3', to: '4', time: 5, line: 'a' })
      .addEdge({ from: '4', to: '5', time: 5, line: 'a' })
      .addEdge({ from: '5', to: '6', time: 5, line: 'a' })
      .addEdge({ from: '6', to: '7', time: 5, line: 'a' })
      ;
    const expected = [
      { node: '3', paths: [
        { from: '2', lines: ['a'], time: 5, initial: '2' },
        { from: '7', lines: ['a'], time: 20, initial: '7' },
      ]},
      { node: '4', paths: [
        { from: '2', lines: ['a'], time: 10, initial: '2' },
        { from: '7', lines: ['a'], time: 15, initial: '7' },
      ]},
    ];

    const intersection = graph.intersect(
      graph.join(
        graph.from('1').maxTime(10).pathData({ initial: '1' }),
        graph.from('2').maxTime(10).pathData({ initial: '2' }),
      ),
      graph.from('7').maxTime(20).pathData({ initial: '7' }),
    ).get();
    compare(intersection, expected);
  });
});
