const { uniqueMap } = require('../map');

describe('uniqueMap', () => {
  it('returns what I expect', () => {
    const map = uniqueMap();
    map.push('a', 1);
    map.push('a', 2);
    map.push('b', 3);
    expect(map.get('a')).toEqual([1, 2]);
    expect(map.get('b')).toEqual([3]);
    expect(map.get('c')).toEqual([]);
  });
});
