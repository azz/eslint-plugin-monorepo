import { RuleTester } from 'eslint';
import path from 'path';
import * as monorepo from '../../src';

const RULE = 'no-relative-import';
const ERROR = {
  message: `Import for monorepo package 'foo' should be absolute.`,
};
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
    {
      code: `const foo = require('foo')`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      options: [{ commonjs: true }],
    },
    {
      code: `define(['foo'], factory)`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      options: [{ amd: true }],
    },
  ],

  invalid: [
    {
      code: `import foo from '../foo'`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      errors: [ERROR],
    },
    {
      code: `const foo = require('../foo')`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      options: [{ commonjs: true }],
      errors: [ERROR],
    },
    {
      code: `define(['../foo'], factory)`,
      filename: path.join(fixtures, 'packages/bar/index.js'),
      options: [{ amd: true }],
      errors: [ERROR],
    },
  ],
});
