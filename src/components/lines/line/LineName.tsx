import { StyleSheet, View } from 'react-native'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from '../../ui/UiActivityIndicator'
import { UiText } from '../../ui/UiText'

import { LineUpdateCountdown } from './LineUpdateCountdown'

import { iconSizes } from '@/constants/uiSizes'

interface LineNameProps {
  lineCode: string
  variant?: 'soft' | 'solid'
}

export const LineName = ({ lineCode, variant = 'solid' }: LineNameProps) => {
  const { schemeColor } = useTheme()
  const { query } = useLine(lineCode)

  const color = variant === 'solid' ? schemeColor.onPrimary : schemeColor.onSurface

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <UiText
          style={{
            fontWeight: 'bold',
            color,
            lineHeight: 24,
          }}
          size="xl"
        >
          {lineCode}
        </UiText>

        {query.isFetching && (
          <UiActivityIndicator
            color={color}
            size={iconSizes['sm']}
          />
        )}
      </View>

      <LineUpdateCountdown lineCode={lineCode} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
})
