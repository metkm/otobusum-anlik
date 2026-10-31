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
  rules: {
    'capitalized-comments': 'off',
    'id-length': 'off',
    'max-nested-callbacks': 'off',
    'max-statements': 'off',
    'no-magic-numbers': 'off',
    'no-ternary': 'off',
    'one-var': 'off',
    'sort-imports': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/max-nested-calls': 'off'
  },
})
