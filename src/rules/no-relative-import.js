import resolve from 'eslint-module-utils/resolve';
import moduleVisitor, {
  makeOptionsSchema,
} from 'eslint-module-utils/moduleVisitor';
import isInside from 'path-is-inside';
import path from 'path';
import getPackages from 'get-monorepo-packages';

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
    if (!node.value.includes('..')) {
      return;
    }
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
        fixer.replaceText(
          node,
          `${pkg.package.name}${
            subPackagePath !== '.' ? '/' + subPackagePath : ''
          }`
        );
      },
    });
  }, moduleUtilOptions);
};

const getPackageDir = (filePath, packages) => {
  const match = packages.find(pkg =>
    isInside(filePath, pkg.location)
  );
  if (match) {
    return match.location;
  }
};
