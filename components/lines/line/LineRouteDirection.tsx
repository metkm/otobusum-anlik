import Ionicons from '@react-native-vector-icons/ionicons'
import { useCallback } from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { UiText } from '@/components/ui/UiText'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { changeRouteDirection } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'

interface Props {
  lineCode: string
  variant?: 'solid' | 'soft'
}

export const LineRouteDirection = ({ lineCode, variant = 'solid' }: Props) => {
  const { getRouteFromCode } = useRoutes(lineCode)

  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const handleSwitchRoute = useCallback(() => {
    changeRouteDirection(lineCode)
  }, [lineCode])

  const route = getRouteFromCode()
  const [leftTitle, rightTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex(variant === 'soft' ? 'onSurface' : 'onPrimary'),
  }

  return (
    <RectButton onPress={handleSwitchRoute} style={styles.lineButtonsContainer}>
      <UiText size="sm" style={[styles.directionText, textStyle]} numberOfLines={1}>
        {leftTitle}
      </UiText>
      <Ionicons name="arrow-forward" size={18} color={textStyle.color} />
      <UiText size="sm" style={[styles.directionText, textStyle]} numberOfLines={1}>
        {rightTitle}
      </UiText>
    </RectButton>
  )
}

const styles = StyleSheet.create({
  routeContainer: {
    gap: 8,
    flexShrink: 0,
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
  },
  directionText: {
    flexBasis: 0,
    flexGrow: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grow: {
    flexGrow: 1,
  },
})
