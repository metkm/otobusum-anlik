import { defineConfig } from 'oxlint'

export default defineConfig({
  categories: {
    correctness: 'warn',
    perf: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
})
