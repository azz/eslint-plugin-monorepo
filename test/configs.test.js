import * as monorepo from '../src';

describe('configs', () => {
  test('exports an object', () => {
    expect(typeof monorepo.configs).toEqual('object');
  });

  test('matches snapshot', () => {
    expect(monorepo.configs).toMatchSnapshot();
  });
});
