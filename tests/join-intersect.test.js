const iso = require('../index');
const { compare } = require('./assert');

describe('join / intersect nodes', () => {
  it('joins an intersection', () => {
    const graph = iso()
      .addEdge({ from: '1', to: '2', time: 5, line: 'a' })
      .addEdge({ from: '2', to: '3', time: 5, line: 'a' })
      .addEdge({ from: '3', to: '4', time: 5, line: 'a' })
      .addEdge({ from: '4', to: '5', time: 5, line: 'a' })
      .addEdge({ from: '5', to: '6', time: 5, line: 'a' })
      .addEdge({ from: '6', to: '7', time: 5, line: 'a' })
      ;
    const expected = [
      // this one comes from the intersection because it's faster
      { node: '3', paths: [
        { from: '7', lines: ['a'], time: 20 },
        { from: '1', lines: ['a'], time: 10 },
      ]},
      // this one is in both but quicker from 6 (10) than the others (15 each)
      { node: '4', paths: [
        { from: '6', lines: ['a'], time: 10 },
      ]},
      { node: '5', paths: [
        { from: '6', lines: ['a'], time: 5 },
      ]},
      { node: '6', paths: [
        { from: '6', lines: [], time: 0 },
      ]},
      { node: '7', paths: [
        { from: '6', lines: ['a'], time: 5 },
      ]},
    ];

    const intersection = graph.intersect(
      // the order here is important, so that the first result in paths is slow
      graph.from('7').maxTime(20),
      graph.from('1').maxTime(20),
    );
    const direct = graph.from('6').maxTime(15);
    const joinIntersect = graph.join(
      intersection,
      direct,
    ).get();
    compare(joinIntersect, expected);
  });

  it('intersects a join', () => {
    const graph = iso()
      .addEdge({ from: '1', to: '2', time: 5, line: 'a' })
      .addEdge({ from: '2', to: '3', time: 5, line: 'a' })
      .addEdge({ from: '3', to: '4', time: 5, line: 'a' })
      .addEdge({ from: '4', to: '5', time: 5, line: 'a' })
      .addEdge({ from: '5', to: '6', time: 5, line: 'a' })
      .addEdge({ from: '6', to: '7', time: 5, line: 'a' })
      ;

    const joinIntersect = graph.intersect(
      graph.join(
        graph.from('1').maxTime(10),
        graph.from('7').maxTime(10),
      ),
      graph.from('3').maxTime(5),
    ).get();
    compare(joinIntersect, [
      { node: '3', paths: [
        { from: '1', lines: ['a'], time: 10 },
        { from: '3', lines: [], time: 0 },
      ]},
      // 4 is not in the join
      { node: '2', paths: [
        { from: '1', lines: ['a'], time: 5 },
        { from: '3', lines: ['a'], time: 5 },
      ]},
    ]);
  });
});
