import { RuleTester } from 'eslint';
import path from 'path';
import * as monorepo from '../../src';

const RULE = 'no-internal-import';
const ERROR = packageName => ({
  message: `Import for monorepo package '${packageName}' is internal.`,
});

const fixtures = path.join(__dirname, '../fixture/yarn');

process.cwd = jest.fn(() => fixtures);

const ruleTester = new RuleTester({
  parserOptions: { sourceType: 'module', ecmaVersion: 2015 },
});

ruleTester.run(RULE, monorepo.rules[RULE], {
  valid: [
    {
      code: `import { pkg } from 'bar'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
    },
    {
      code: `import { pkg } from 'bar/allowed'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
    },
    {
      code: `import { pkg } from 'bar/nested/allowedToo'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
    },
    {
      code: `import { pkg } from 'bar/nested/this/is/also/allowed'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
    },
    {
      code: `import { pkg } from 'bar/complex/glob/anything/goes/here/test.ts'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
    },
  ],

  invalid: [
    {
      code: `import pkg from 'foo/src/pkg'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      errors: [ERROR('foo')],
    },
    {
      code: `import { pkg } from 'bar/allowedNot'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      errors: [ERROR('bar')],
    },
    {
      code: `import { pkg } from 'bar/complex/glob/anything/goes/here/test.tsx'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      errors: [ERROR('bar')],
    },
  ],
});
