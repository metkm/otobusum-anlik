import { StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const DEFAULT_PAGE_PADDING = 8

export function usePaddings(pagePadding = DEFAULT_PAGE_PADDING) {
  const insets = useSafeAreaInsets()

  const tabRoutePaddings: StyleProp<ViewStyle> = {
    paddingTop: insets.top + pagePadding,
    paddingBottom: pagePadding,
    paddingLeft: insets.left + pagePadding,
    paddingRight: insets.right + pagePadding,
  }

  const modalRoutePaddings: StyleProp<ViewStyle> = {
    paddingTop: insets.top + pagePadding,
    paddingBottom: insets.bottom + pagePadding,
    paddingLeft: insets.left + pagePadding,
    paddingRight: insets.right + pagePadding,
  }

  const stackRoutePaddings: StyleProp<ViewStyle> = {
    paddingTop: pagePadding,
    paddingBottom: insets.bottom + pagePadding,
    paddingLeft: insets.left + pagePadding,
    paddingRight: insets.right + pagePadding,
  }

  return {
    tabRoutePaddings,
    modalRoutePaddings,
    stackRoutePaddings,
  }
}
