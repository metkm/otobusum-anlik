import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from '../../ui/UiActivityIndicator'
import { UiText } from '../../ui/UiText'

import { useLinesStore, getTheme } from '@/stores/lines'

interface LineNameProps {
  lineCode: string
  variant?: 'soft' | 'solid'
}

export const LineName = ({ lineCode, variant = 'solid' }: LineNameProps) => {
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))

  const { getSchemeColorHex } = useTheme(lineTheme)
  const { query } = useLine(lineCode)

  const color = getSchemeColorHex(variant === 'solid' ? 'onPrimary' : 'onSurface')

  return (
    <View style={styles.container}>
      <UiText
        style={{
          fontWeight: 'bold',
          fontSize: 24,
          color,
        }}
      >
        {lineCode}
      </UiText>

      {query.isFetching && (
        <UiActivityIndicator
          color={color}
          size={24}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
