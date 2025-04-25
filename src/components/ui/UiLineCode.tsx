import { useMemo } from 'react'
import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from './UiText'

interface Props extends TextProps {
  lineCode?: string
}

export const UiLineCode = ({ lineCode, ...props }: Props) => {
  const { schemeColor } = useTheme(lineCode)

  const renderCodeContainer: StyleProp<TextStyle> = useMemo(() => ({
    backgroundColor: schemeColor.primary,
    color: schemeColor.onPrimary,
  }), [schemeColor])

  return (
    <UiText style={[styles.renderCode, renderCodeContainer]}>
      {lineCode}
      {props.children}
    </UiText>
  )
}

const styles = StyleSheet.create({
  renderCode: {
    borderRadius: 999,
    padding: 9,
    minWidth: 70,
    textAlign: 'center',
  },
})
