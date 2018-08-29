const { minUniqueList, findInAll } = require('../list');

describe('minUniqueList', () => {
  it('returns what I expect', () => {
    const map = minUniqueList('a', 'b');
    map.push({ a: 1, b: 5 });
    map.push({ a: 1, b: 10 }); // this will be ignored
    map.push({ a: 2, b: 10 });
    map.push({ a: 2, b: 4 }); // this will replace the last value
    map.push({ a: 1, b: 3 }); // this will replace an older value
    expect(map.get()).toEqual([
      { a: 1, b: 3 },
      { a: 2, b: 4 },
    ]);
  });

  it('exposes methods from the Array prototype', () => {
    const map = minUniqueList('a', 'b');
    map.push({ a: 1, b: 5 });
    map.push({ a: 2, b: 10 });
    map.push({ a: 3, b: 3 });
    expect(map.map((x) => x.b)).toEqual([5, 10, 3]);
    expect(map.reduce((total, x) => total + x.b, 0)).toEqual(18);
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
