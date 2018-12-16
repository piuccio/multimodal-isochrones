const { minPathList, findInAll } = require('../list');

describe('minPathList', () => {
  it('returns what I expect', () => {
    const map = minPathList('a');
    map.add('1', 5, []);
    map.add('1', 10, []); // this will be ignored
    map.add('2', 10, []);
    map.add('2', 4, []); // this will replace the last value
    map.add('1', 3, []); // this will replace an older value
    expect(map.get()).toEqual([
      { node: '1', paths: [{ from: 'a', time: 3, lines: [] }]},
      { node: '2', paths: [{ from: 'a', time: 4, lines: [] }]},
    ]);
  });
});

describe('findInAll', () => {
  it('filters the list by object', () => {
    const array = [
      [{ a: 1, value: 2 }, { a: 2, value: 3 }, { a: 3, value: 4 }],
      [{ a: 1, value: 4 }, { a: 3, value: 5 }],
      [{ a: 1, value: 5 }],
      [{ a: 1, value: 6 }, { a: 4, value: 7 }],
    ];
    expect(findInAll('a', 1, array)).toEqual([
      { a: 1, value: 2 },
      { a: 1, value: 4 },
      { a: 1, value: 5 },
      { a: 1, value: 6 },
    ]);
    expect(findInAll('a', 2, array)).toBeNull();
  });
});
