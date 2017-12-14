import moduleVisitor, {
  makeOptionsSchema,
} from 'eslint-module-utils/moduleVisitor';
import parse from 'parse-package-name';
import getPackages from '../get-packages';

export const meta = {
  schema: [makeOptionsSchema({})],
};

export const create = context => {
  const { options: [moduleUtilOptions] } = context;
  const packages = getPackages(process.cwd());

  return moduleVisitor(node => {
    const { name, path: internalPath } = tryParse(node.value);
    if (internalPath && packages.find(pkg => pkg.name === name)) {
      context.report({
        node,
        message: `Import for monorepo package '${name}' is internal.`,
      });
    }
  }, moduleUtilOptions);
};

const tryParse = text => {
  try {
    return parse(text);
  } catch (error) {
    return { path: text, name: '' };
  }
};
