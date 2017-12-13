import moduleVisitor, {
  makeOptionsSchema,
} from 'eslint-module-utils/moduleVisitor';
import parse from 'parse-package-name';
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
};

export const create = context => {
  const { options: [{ rootDir, ...moduleUtilOptions }] } = context;
  const packages = getPackages(rootDir);

  return moduleVisitor(node => {
    const { name, path: internalPath } = parse(node.value);
    if (internalPath && packages.find(pkg => pkg.name === name)) {
      context.report({
        node,
        message: `Import for monorepo package '${name}' is internal.`,
      });
    }
  }, moduleUtilOptions);
};
