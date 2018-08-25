const iso = require('../index');

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
    expect(actual).toHaveLength(expected.length);
    // I don't care much about the order of results
    expected.forEach((result) => {
      expect(actual.find((_) => _.node === result.node)).toEqual(result);
    });
  });
});
