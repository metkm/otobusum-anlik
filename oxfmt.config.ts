import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['*.d.ts'],
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  sortImports: true,
  sortTailwindcss: true,
})
