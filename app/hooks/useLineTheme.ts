export const useLineTheme = (_code: string) => {
  const scheme = useColorMode()
  const colors = createHexColors()

  const cssVariableTemplate = `
    --ui-color-neutral-50: ${colors[0]};
    --ui-color-neutral-100: ${colors[1]};
    --ui-color-neutral-200: ${colors[2]};
    --ui-color-neutral-300: ${colors[3]};
    --ui-color-neutral-400: ${colors[4]};
    --ui-color-neutral-500: ${colors[5]};
    --ui-color-neutral-600: ${colors[6]};
    --ui-color-neutral-700: ${colors[7]};
    --ui-color-neutral-800: ${colors[8]};
    --ui-color-neutral-900: ${colors[9]};
    --ui-color-neutral-950: ${colors[10]};

    ${
      scheme.value === 'dark'
        ? `
        --ui-bg: var(--ui-color-neutral-900);
        --ui-bg-muted: var(--ui-color-neutral-800);
        --ui-bg-elevated: var(--ui-color-neutral-800);
        --ui-text: var(--ui-color-neutral-200);
        --ui-border: var(--ui-color-neutral-800);
        --ui-border-muted: var(--ui-color-neutral-700);
        --ui-border-accented: var(--ui-color-neutral-700);
        --ui-border-inverted: #fff`
        : `
        --ui-bg: white;
        --ui-bg-muted: var(--ui-color-neutral-50);
        --ui-bg-elevated: var(--ui-color-neutral-100);
        --ui-text: var(--ui-color-neutral-700);
          --ui-border: var(--ui-color-neutral-200);
        --ui-border-muted: var(--ui-color-neutral-200);
        --ui-border-accented: var(--ui-color-neutral-300);
        --ui-border-inverted: var(--ui-color-neutral-900)
      `
    }
  `

  return {
    cssVariableTemplate,
  }
}
