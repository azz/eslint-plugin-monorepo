import resolve from 'eslint-module-utils/resolve';
import moduleVisitor, {
  makeOptionsSchema,
} from 'eslint-module-utils/moduleVisitor';
import isInside from 'path-is-inside';
import path from 'path';
import getPackages from '../get-packages';

export const meta = {
  schema: [
    makeOptionsSchema({
      rootDir: {
        type: 'string',
        required: true,
      },
    }),
  ],
  fixable: 'code',
};

export const create = context => {
  const { options: [{ rootDir, ...moduleUtilOptions }] } = context;
  const sourceFsPath = context.getFilename();
  const packages = getPackages(rootDir);

  return moduleVisitor(node => {
    const resolvedPath = resolve(node.value, context);

    if (!resolvedPath || isInside(resolvedPath, path.dirname(sourceFsPath))) {
      return;
    }

    const pkg = packages.find(pkg => isInside(resolvedPath, pkg.fsPath));
    if (pkg) {
      const subPackagePath = path.relative(pkg.fsPath, resolvedPath);
      context.report({
        node,
        message: `Import for monorepo package '${
          pkg.name
        }' should be absolute.`,
        fix: fixer => {
          fixer.replaceText(
            node,
            `${pkg.name}${subPackagePath !== '.' ? '/' + subPackagePath : ''}`
          );
        },
      });
    }
  }, moduleUtilOptions);
};
