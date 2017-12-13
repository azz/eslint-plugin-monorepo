import * as monorepo from '..';

describe('rules', () => {
  test('exports an object', () => {
    expect(typeof monorepo.rules).toEqual('object');
  });
});
