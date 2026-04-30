import { use } from 'react'
import { useColorScheme as _useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineContext } from './useLine'

import { ColorScheme, useSettingsStore, useThemeStore } from '@/stores'

type VariantConfig<V, S> = {
  variants: {
    slots: S
    variant: V
  }
  compoundVariants: {
    variant: keyof V
    style: Partial<{ [K in keyof S]: S[K] }>
  }[]
}

type VariantReturnType<V, S> = {
  [T in keyof S]: (options?: { variant?: keyof V }) => S[T] | undefined
}

const createLineVariants = <V extends object, S>(config: VariantConfig<V, S>): VariantReturnType<V, S> => {
  const result = {} as VariantReturnType<V, S>

  for (const slot in config.variants.slots) {
    const defaultVariant = Object.keys(config.variants.variant)[0]

    result[slot] = (_config) => {
      const st = config.compoundVariants.find(cv => cv.variant === (_config?.variant ?? defaultVariant))
      return st?.style[slot]
    }
  }

  return result
}

export const useColorScheme = (): ColorScheme => {
  const colorSchemeStore = useSettingsStore(useShallow(state => state.colorScheme))
  const colorScheme = _useColorScheme()

  if (colorSchemeStore)
    return colorSchemeStore

  return colorScheme === 'unspecified' ? 'dark' : colorScheme

  // const sc = colorSchemeStore || colorScheme
  // return sc === 'unspecified' ? 'dark' : sc
}

export const useLineTheme = () => {
  const code = use(LineContext)

  const themes = useThemeStore(useShallow(state => state.getThemes()))
  const colorScheme = useColorScheme()

  if (!code)
    return

  const theme = themes[code]?.[colorScheme === undefined ? 'dark' : colorScheme]
  if (!theme)
    return

  return createLineVariants({
    variants: {
      slots: {
        background: { backgroundColor: '' },
        text: { color: '' },
        border: { borderColor: '' },
        backgroundWithColor: { backgroundColor: '', color: '' },
      },
      variant: {
        solid: {},
        soft: {},
        ghost: {},
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        style: {
          background: {
            backgroundColor: theme['ui-primary'],
          },
          border: {
            borderColor: theme['ui-border'],
          },
          text: {
            color: theme['ui-text-inverted'],
          },
          backgroundWithColor: {
            backgroundColor: theme['ui-primary'],
            color: theme['ui-text-inverted'],
          },
        },
      },
      {
        variant: 'soft',
        style: {
          background: {
            backgroundColor: theme['ui-bg-muted'],
          },
          border: {
            borderColor: theme['ui-border-muted'],
          },
          text: {
            color: theme['ui-text'],
          },
          backgroundWithColor: {
            backgroundColor: theme['ui-bg-muted'],
            color: theme['ui-text'],
          },
        },
      },
      {
        variant: 'ghost',
        style: {
          background: {
            backgroundColor: theme['ui-bg'],
          },
          border: {
            borderColor: theme['ui-border-muted'],
          },
          text: {
            color: theme['ui-text'],
          },
          backgroundWithColor: {
            backgroundColor: theme['ui-bg'],
            color: theme['ui-text'],
          },
        },
      },
    ],
  })

  // const borderStyle = border({ variant: 'solid' })

  // return createLineVariants(variant, theme)

  // const colorScheme = useColorScheme()
  // const themes = useThemeStore(useShallow(state => state.themes()))
  // const prefer = colorScheme === 'unspecified' ? 'dark' : colorScheme

  // if (!code)
  //   return

  // return themes[code]?.[prefer]
}
