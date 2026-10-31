import { defineConfig } from 'oxlint'

export default defineConfig({
  categories: {
    correctness: 'warn',
    perf: 'warn',
    style: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ['react'],
  rules: {
    'capitalized-comments': 'off',
    'func-style': 'off',
    'id-length': 'off',
    'max-nested-callbacks': 'off',
    'max-statements': 'off',
    'no-magic-numbers': 'off',
    'no-ternary': 'off',
    'one-var': 'off',
    'react/exhaustive-deps': 'warn',
    'react/function-component-definition': [
      'warn',
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],
    'react/jsx-max-depth': 'off',
    'react/jsx-props-no-spreading': 'off',
    'sort-imports': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/max-nested-calls': 'off',
  },
})
