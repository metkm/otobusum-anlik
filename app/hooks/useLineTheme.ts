export const useLineTheme = (lineCode: string) => {
  const colorMode = useColorMode()
  const linesThemeStore = useLinesThemeStore()
  const filtersStore = useFiltersStore()

  const scheme = computed(() => {
    const colorSchemes = linesThemeStore.allThemes[filtersStore.city].get(lineCode)
    return colorSchemes?.[colorMode.value as keyof typeof colorSchemes]
  })

  return {
    colorMode,
    scheme,
  }
}
