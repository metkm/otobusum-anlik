import { hexFromArgb } from '@material/material-color-utilities'

export const useLineTheme = (_code: string) => {
  const scheme = useColorMode()
  const { schemes, palettes } = createRandomTheme()

  const cssVariableTemplate = computed(() => `
    ${
      scheme.value === 'dark'
        ? `
        --ui-primary: ${hexFromArgb(schemes.dark.primary)};
        --ui-bg: ${hexFromArgb(schemes.dark.surface)};
        --ui-bg-muted: ${hexFromArgb(palettes.neutral.tone(12))};
        --ui-bg-elevated: ${hexFromArgb(palettes.neutral.tone(17))};
        --ui-text:  ${hexFromArgb(schemes.dark.onSurface)};
        --ui-text-inverted:  ${hexFromArgb(schemes.dark.inverseOnSurface)};
        --ui-border-muted: ${hexFromArgb(schemes.dark.outlineVariant)};
        `
        : `
        --ui-primary: ${hexFromArgb(schemes.light.primary)};
        --ui-bg: ${hexFromArgb(schemes.light.surface)};
        --ui-bg-muted: ${hexFromArgb(palettes.neutral.tone(94))};
        --ui-bg-elevated: ${hexFromArgb(palettes.neutral.tone(92))};
        --ui-text:  ${hexFromArgb(schemes.light.onSurface)};
        --ui-text-inverted:  ${hexFromArgb(schemes.light.inverseOnSurface)};
        --ui-border-muted: ${hexFromArgb(schemes.light.outlineVariant)};
      `
    }
  `)

  return {
    cssVariableTemplate,
  }
}

// --ui-primary: ${hexFromArgb(schemes.dark.primary)};
// --ui-bg: ${hexFromArgb(schemes.dark.surface)};
// --ui-bg-muted: var(--ui-color-neutral-800);
// --ui-bg-elevated: var(--ui-color-neutral-800);
// --ui-text:  ${hexFromArgb(schemes.dark.onSurface)};
// --ui-text-inverted:  ${hexFromArgb(schemes.dark.inverseOnSurface)};
// --ui-border: var(--ui-color-neutral-800);
// --ui-border-muted: var(--ui-color-neutral-700);
// --ui-border-accented: var(--ui-color-neutral-700);
// --ui-border-inverted: #fff`

// --ui-color-neutral-50: ${colorShades[0]};
// --ui-color-neutral-100: ${colorShades[1]};
// --ui-color-neutral-200: ${colorShades[2]};
// --ui-color-neutral-300: ${colorShades[3]};
// --ui-color-neutral-400: ${colorShades[4]};
// --ui-color-neutral-500: ${colorShades[5]};
// --ui-color-neutral-600: ${colorShades[6]};
// --ui-color-neutral-700: ${colorShades[7]};
// --ui-color-neutral-800: ${colorShades[8]};
// --ui-color-neutral-900: ${colorShades[9]};
// --ui-color-neutral-950: ${colorShades[10]};
