# `eslint-plugin-monorepo`

A collection of ESLint rules for enforcing import rules in a monorepo. Supports:

* [Lerna](https://github.com/lerna/lerna)
* [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)

## Configuration

Use the `"recommended"` configuration:

```json
// .eslintrc.json
{
  "extends": ["plugin:monorepo/recommended"]
}
```

Or enable rules manually:

```json
// .eslintrc.json
{
  "plugins": ["monorepo"],
  "rules": {
    "monorepo/no-internal-import": "error",
    "monorepo/no-relative-import": "error"
  }
}
```

## Rules

### `monorepo/no-internal-import`

Forbids importing specific files from a monorepo package.

```js
// Bad
import '@company/module/src/foo.js';

// Good
import { foo } from '@company/module';
```

### `monorepo/no-relative-import` (fixable)

Forbids importing other packages from the monorepo with a relative path.

```js
// Bad
import module from '../module';

// Good
import module from '@company/module';
```
