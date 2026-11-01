import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { createTV } from 'tailwind-variants/config'

const config = {
  extend: {
    classGroups: {
      'border-b': ['border-b-hairline'],
      'border-t': ['border-t-hairline'],
      'border-w': ['border-hairline'],
    },
  },
} satisfies Parameters<typeof createTV>['0']['twMergeConfig']

export const tv = createTV({
  twMergeConfig: config,
})

const customTwMerge = extendTailwindMerge(config)

export const cn = (...inputs: ClassValue[]) => customTwMerge(clsx(inputs))
