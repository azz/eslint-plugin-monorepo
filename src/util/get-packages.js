import getPackages from 'get-monorepo-packages';

const packageMap = new Map();

export default function getPackagesWithCache(directory) {
  // We assume that the set of monorepo packages for this directory will
  // not change during a single eslint run
  let packages = packageMap.get(directory);
  if (!packages) {
    packages = getPackages(directory);
    packageMap.set(directory, packages);
  }

  return packages;
}
