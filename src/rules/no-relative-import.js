import moduleVisitor, {
  makeOptionsSchema,
} from 'eslint-module-utils/moduleVisitor';

import getPackages from 'get-monorepo-packages';
import isInside from 'path-is-inside';
import minimatch from 'minimatch';
import path from 'path';
import resolve from 'eslint-module-utils/resolve';

export const meta = {
  schema: [makeOptionsSchema({})],
  fixable: 'code',
};

export const create = context => {
  const {
    options: [moduleUtilOptions],
  } = context;
  const sourceFsPath = context.getFilename();
  const packages = getPackages(process.cwd());

  return moduleVisitor(node => {
    const resolvedPath = resolve(node.value, context);
    const packageDir = getPackageDir(sourceFsPath, packages);

    if (!packageDir || !resolvedPath || isInside(resolvedPath, packageDir)) {
      return;
    }

    const pkg = packages.find(pkg => isInside(resolvedPath, pkg.location));
    if (!pkg) {
      return;
    }

    const subPackagePath = path.relative(pkg.location, resolvedPath);
    context.report({
      node,
      message: `Import for monorepo package '${pkg.package.name}' should be absolute.`,
      fix: fixer => {
        const basePath = '' + pkg.package.name + (subPackagePath !== '.' ? '/' + subPackagePath : '')
        const path = _path.parse(basePath).dir
        const name = _path.parse(basePath).name
        return fixer.replaceText(node, '\'' + (name !== '.' && name !== 'index' ? path + '/' + name : path) + '\'');
      },
    });
  }, moduleUtilOptions);
};

const getPackageDir = (filePath, packages) => {
  const match = packages.find(pkg =>
    minimatch(filePath, path.join(pkg.location, '**'))
  );
  if (match) {
    return match.location;
  }
};
