import * as monorepo from '..';

describe('configs', () => {
  test('exports an object', () => {
    expect(typeof monorepo.configs).toEqual('object');
  });
});
