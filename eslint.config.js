import stylistic from "@stylistic/eslint-plugin";
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'

export default [
  stylistic.configs.recommended,
  reactPlugin.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "@stylistic/brace-style": ["error", "1tbs"],
      // "import/order": [
      //   "error",
      //   {
      //     distinctGroup: true,
      //     "newlines-between": "always",
      //     alphabetize: {
      //       order: "asc",
      //       caseInsensitive: true,
      //     },
      //     pathGroups: [
      //       {
      //         pattern: "@/components/**",
      //         group: "external",
      //         position: "after",
      //       },
      //       {
      //         pattern: "@/hooks/**",
      //         group: "external",
      //         position: "after",
      //       },
      //     ],
      //   },
      // ],
      'react/react-in-jsx-scope': ['off'],
      'react/prop-types': ['off'],
      'react/function-component-definition': ['error', {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      }],
    },
  },
  {
    ignores: ['dist/*'],
  },
];

// const stylistic = require('@stylistic/eslint-plugin')

// https://docs.expo.dev/guides/using-eslint/
// module.exports = {
//   extends: [
//     'expo',
//     'plugin:react/recommended',
//   ],
//   plugins: [
//     '@stylistic',
//   ],
//   rules: {
//     ...stylistic.configs['recommended-extends'].rules,
//     '@stylistic/brace-style': ['error', '1tbs'],
//     'import/order': ['error', {
//       'distinctGroup': true,
//       'newlines-between': 'always',
//       'alphabetize': {
//         order: 'asc',
//         caseInsensitive: true,
//       },
//       'pathGroups': [
//         {
//           pattern: '@/components/**',
//           group: 'external',
//           position: 'after',
//         },
//         {
//           pattern: '@/hooks/**',
//           group: 'external',
//           position: 'after',
//         },
//       ],
//     }],
//     'react/react-in-jsx-scope': ['off'],
//     'react/prop-types': ['off'],
//     'react/function-component-definition': ['error', {
//       namedComponents: 'arrow-function',
//       unnamedComponents: 'arrow-function',
//     }],
//   },
// }
