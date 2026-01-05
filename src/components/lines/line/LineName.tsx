import { StyleSheet, View } from 'react-native'

import { useLine } from '@/hooks/queries/useLine'
import { useCountdown } from '@/hooks/useCountdown'
import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from '../../ui/UiActivityIndicator'
import { UiText } from '../../ui/UiText'

import { iconSizes } from '@/constants/uiSizes'
import { i18n } from '@/translations/i18n'

interface LineNameProps {
  lineCode: string
  variant?: 'soft' | 'solid'
}

export const LineName = ({ lineCode, variant = 'solid' }: LineNameProps) => {
  const { schemeColor } = useTheme()
  const { query } = useLine(lineCode)
  const { count } = useCountdown(query.dataUpdatedAt)

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

      <UiText size="sm" dimmed numberOfLines={1}>{i18n.t('updateCount', { count: Math.floor(count / 1_000) })}</UiText>
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
