import moduleVisitor, {
  makeOptionsSchema,
} from 'eslint-module-utils/moduleVisitor';

import fs from 'fs';
import getPackages from 'get-monorepo-packages';
import minimatch from 'minimatch';
import parse from 'parse-package-name';
import path from 'path';

export const meta = {
  schema: [makeOptionsSchema({})],
  fixable: 'code'
};

const withoutExtension = (importFile, fileEntry) => {
  const importExt = path.extname(importFile);
  if (importExt !== '') return [importFile, fileEntry];

  const fileEntryExt = path.extname(fileEntry);
  const newFileEntry =
    fileEntryExt !== ''
      ? fileEntry.replace(new RegExp(`\\${fileEntryExt}$`), '')
      : fileEntry;
  return [importFile, newFileEntry];
};

export const create = context => {
  const {
    options: [moduleUtilOptions],
  } = context;
  const packages = getPackages(process.cwd());

  return moduleVisitor(node => {
    const { name, path: internalPath } = tryParse(node.value);
    const matchedPackage = packages.find(pkg => pkg.package.name === name);

    if (!internalPath) return;
    if (!matchedPackage) return;

    const packageRoot = matchedPackage.location;

    // Need to take care of "files" field, since they are
    // supposed to be part of the public API of the package
    const absolutePathsForFiles =
      matchedPackage.package.files &&
      matchedPackage.package.files.reduce((acc, file) => {
        const fileOrDirOrGlob = path.join(packageRoot, file);
        acc.push(fileOrDirOrGlob);

        try {
          if (fs.lstatSync(fileOrDirOrGlob).isDirectory()) {
            // Need to also include
            // all of the files inside the folder
            acc.push(path.join(fileOrDirOrGlob, '**', '*'));
          }
        } catch (e) {
          // do nothing
        }

        return acc;
      }, []);
    const absoluteInternalPath = path.join(packageRoot, internalPath);

    if (absolutePathsForFiles) {
      const isImportWithinFiles = absolutePathsForFiles.some(maybeGlob => {
        // If import doesn't have an extension, strip it from the file entry
        const [theImport, theFileEntry] = withoutExtension(
          absoluteInternalPath,
          maybeGlob
        );
        return minimatch(theImport, theFileEntry);
      });

      if (isImportWithinFiles) return;
    }

    context.report({
      node,
      message: `Import for monorepo package '${name}' is internal.`,
      fix: function fix(fixer) {
        const path = _path.parse(node.value).dir
        return fixer.replaceText(node, '\'' + path + '\'');
      }
    });
  }, moduleUtilOptions);
};

const tryParse = text => {
  try {
    return parse(text);
  } catch (error) {
    return { path: text, name: '' };
  }
};
