export const useLineTheme = (code: string) => {
  // const code = _code.toLowerCase()

  const scheme = useColorMode()
  const colors = createHexColors()

  const cssVariableTemplate = `
    --ui-color-neutral-${code}-50: ${colors[0]};
    --ui-color-neutral-${code}-100: ${colors[1]};
    --ui-color-neutral-${code}-200: ${colors[2]};
    --ui-color-neutral-${code}-300: ${colors[3]};
    --ui-color-neutral-${code}-400: ${colors[4]};
    --ui-color-neutral-${code}-500: ${colors[5]};
    --ui-color-neutral-${code}-600: ${colors[6]};
    --ui-color-neutral-${code}-700: ${colors[7]};
    --ui-color-neutral-${code}-800: ${colors[8]};
    --ui-color-neutral-${code}-900: ${colors[9]};
    --ui-color-neutral-${code}-950: ${colors[10]};

    ${
      scheme.value === 'dark'
        ? `
        --ui-${code}-bg: var(--ui-color-neutral-${code}-900);
        --ui-${code}-bg-muted: var(--ui-color-neutral-${code}-800);
        --ui-${code}-bg-elevated: var(--ui-color-neutral-${code}-800);
        --ui-${code}-text: var(--ui-color-neutral-${code}-200);
        --ui-${code}-border: var(--ui-color-neutral-${code}-800);
        --ui-${code}-border-muted: var(--ui-color-neutral-${code}-700);
        --ui-${code}-border-accented: var(--ui-color-neutral-${code}-700);
        --ui-${code}-border-inverted: #fff`
        : `
        --ui-${code}-bg: white;
        --ui-${code}-bg-muted: var(--ui-color-neutral-${code}-50);
        --ui-${code}-bg-elevated: var(--ui-color-neutral-${code}-100);
        --ui-${code}-text: var(--ui-color-neutral-${code}-700);
        --ui-${code}-border: var(--ui-color-neutral-${code}-200);
        --ui-${code}-border-muted: var(--ui-color-neutral-${code}-200);
        --ui-${code}-border-accented: var(--ui-color-neutral-${code}-300);
        --ui-${code}-border-inverted: var(--ui-color-neutral-${code}-900)
      `
    }
  `

  return {
    cssVariableTemplate,
  }
}
