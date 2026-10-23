import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { UBadge } from '@/components/u/UBadge'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'
import { useCountdown, useLine, useLineBuses } from '@/composables'

export const LineCardName = () => {
  const { code } = useLine()
  const { query: lineBusesQuery } = useLineBuses()

  const duration = lineBusesQuery.data
    ? lineBusesQuery.data.next_poll * 1000 - lineBusesQuery.dataUpdatedAt
    : undefined

  const { remaining } = useCountdown(lineBusesQuery.dataUpdatedAt, duration)
  const { t } = useTranslation()

  return (
    <View className="shrink grow flex-row items-center gap-2 overflow-hidden">
      <UBadge
        label={code}
        variant="soft"
        size="lg"
        className="rounded-sm"
      />

      <Animated.View
        key={lineBusesQuery.isFetching ? 'loading' : 'text'}
        entering={FadeInDown}
        exiting={FadeOutUp}
        className="shrink"
      >
        <UQueryState
          query={lineBusesQuery}
          error={() => (
            <UText className="text-error font-inter-medium text-sm">
              {t('errorGettingBusLocations')}
            </UText>
          )}
        >
          <UText
            className="text-muted font-inter-medium text-sm"
            numberOfLines={1}
          >
            {t('updateCount', { count: remaining })}
          </UText>
        </UQueryState>
      </Animated.View>
    </View>
  )
}
