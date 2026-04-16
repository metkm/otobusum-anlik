export const useLineTheme = () => {
  const colorMode = useColorMode()
  const themeStore = useThemeStore()
  const { code } = useLine()

  const scheme = computed(() => themeStore.themes[toValue(code)]?.[colorMode.value as keyof Schemes])

  const cssVariableTemplate = computed(() => {
    if (!scheme.value)
      return

    return Object.entries(scheme.value)
      .map(([key, val]) => `--${key}: ${val}`)
      .join(';')
  })

  return {
    cssVariableTemplate,
    scheme,
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
