exports.compare = function (actual, expected) {
  expect(actual).toHaveLength(expected.length);
  // I don't care much about the order of results
  expected.forEach((result) => {
    expect(actual.find((_) => _.node === result.node)).toEqual(result);
  });
}
