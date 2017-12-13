import { RuleTester } from 'eslint';
import path from 'path';
import * as monorepo from '../../src';

const RULE = 'no-relative-import';
const fixtures = path.join(__dirname, '../fixture/yarn');

process.cwd = jest.fn(() => fixtures);

const ruleTester = new RuleTester({
  parserOptions: { sourceType: 'module', ecmaVersion: 2015 },
});

ruleTester.run(RULE, monorepo.rules[RULE], {
  valid: [
    {
      code: `import foo from 'foo'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
    },
  ],

  invalid: [
    {
      code: `import foo from '../foo'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      errors: [
        { message: `Import for monorepo package 'foo' should be absolute.` },
      ],
    },
  ],
});
