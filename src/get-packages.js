import loadJsonFile from 'load-json-file';
import globby from 'globby';
import path from 'path';
import fs from 'fs';

export default directory => {
  const lernaJsonPath = path.join(directory, 'lerna.json');
  if (fs.existsSync(lernaJsonPath)) {
    const lernaJson = loadJsonFile.sync(lernaJsonPath);
    if (!lernaJson.useWorkspaces) {
      return findPackages(lernaJson.packages, directory);
    }
  }

  const pkgJsonPath = path.join(directory, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = loadJsonFile.sync(pkgJsonPath);
    if (pkgJson.workspaces) {
      return findPackages(pkgJson.workspaces, directory);
    }
  }

  // Bail if we don't find any packages
  return [];
};

const findPackages = (packageSpecs, rootDirectory) => {
  return packageSpecs
    .reduce(
      (pkgDirs, pkgGlob) => [
        ...pkgDirs,
        ...globby.sync(path.join(rootDirectory, pkgGlob), {
          nodir: false,
        }),
      ],
      []
    )
    .map(fsPath => ({ fsPath, name: getPackageName(fsPath) }))
    .filter(({ name }) => name);
};

const getPackageName = packagePath => {
  const pkgJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = loadJsonFile.sync(pkgJsonPath);
    return pkgJson.name;
  }
};
