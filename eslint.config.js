import stylistic from '@stylistic/eslint-plugin'
import expoPlugin from 'eslint-config-expo/flat.js'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'

export default [
  ...expoPlugin,
  stylistic.configs.recommended,
  reactPlugin.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
      'import/order': [
        'error',
        {
          'distinctGroup': true,
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'pathGroups': [
            {
              pattern: '@/components/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/hooks/**',
              group: 'external',
              position: 'after',
            },
          ],
        },
      ],
      'react/react-in-jsx-scope': ['off'],
      'react/prop-types': ['off'],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },
  {
    ignores: ['dist/*'],
  },
]
