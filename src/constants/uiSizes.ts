type Sizes = 'sm' | 'md' | 'lg'

export type FontSize = Sizes | 'xl' | 'xs'
export type IconSize = Sizes
export type size = Sizes

export type ButtonVariants = 'solid' | 'soft' | 'ghost' | 'error'

export const iconSizes: Record<IconSize, number> = {
  sm: 16,
  md: 18,
  lg: 24,
}

export const fontSizes: Record<FontSize, number> = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 22,
}
