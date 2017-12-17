import getPackages from '../src/get-packages';
import path from 'path';

const LERNA_DIR = path.join(__dirname, 'fixture/lerna');
const YARN_DIR = path.join(__dirname, 'fixture/yarn');

expect.addSnapshotSerializer({
  test: value =>
    typeof value === 'string' &&
    (value.indexOf('\\') > -1 || value.indexOf(process.cwd()) > -1),
  print: (value, serializer) =>
    serializer(value.replace(process.cwd(), '<cwd>').replace(/\\/g, '/')),
});

describe('getPackages()', () => {
  test('lerna matches snapshot', () => {
    expect(getPackages(LERNA_DIR)).toMatchSnapshot();
  });

  test('yarn matches snapshot', () => {
    expect(getPackages(YARN_DIR)).toMatchSnapshot();
  });

  test('returns empty array when no packages', () => {
    expect(getPackages(__dirname)).toEqual([]);
  });
});
