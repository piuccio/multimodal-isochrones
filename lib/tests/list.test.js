const { minPathList } = require('../list');

describe('minPathList', () => {
  it('returns what I expect', () => {
    const map = minPathList('a');
    map.add('1', 5, []);
    map.add('1', 10, []); // this will be ignored
    map.add('2', 10, []);
    map.add('2', 4, []); // this will replace the last value
    map.add('1', 3, []); // this will replace an older value
    expect(map.get()).toEqual({
      1: { node: '1', paths: [{ from: 'a', time: 3, lines: [] }]},
      2: { node: '2', paths: [{ from: 'a', time: 4, lines: [] }]},
    });
  });
});
