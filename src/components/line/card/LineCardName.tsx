import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useCountdown, useLine, useLineBuses } from '@/composables'

export const LineCardName = () => {
  const { code } = useLine()
  const { query: lineBusesQuery } = useLineBuses()

  const duration = lineBusesQuery.data ? lineBusesQuery.data.next_poll * 1000 - lineBusesQuery.dataUpdatedAt : undefined

  const { remaining } = useCountdown(lineBusesQuery.dataUpdatedAt, duration)
  const { t } = useTranslation()

  return (
    <View className="flex-row items-center gap-2 shrink grow overflow-hidden">
      <UText className="font-inter-semibold text-lg">
        {code}
      </UText>

      <Animated.View
        key={lineBusesQuery.isFetching ? 'loading' : 'text'}
        entering={FadeInDown}
        exiting={FadeOutUp}
        className="shrink"
      >
        <UQueryState
          query={lineBusesQuery}
          errorMessage={t('errorGettingBusLocations')}
        >
          <UText className="text-xs text-muted font-inter-medium" numberOfLines={1}>
            {t('updateCount', { count: remaining })}
          </UText>
        </UQueryState>
      </Animated.View>
    </View>
  )
}
