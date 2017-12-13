import * as monorepo from '../src';

describe('rules', () => {
  test('exports an object', () => {
    expect(typeof monorepo.rules).toEqual('object');
  });

  test('matches snapshot', () => {
    expect(monorepo.rules).toMatchSnapshot();
  });
});
