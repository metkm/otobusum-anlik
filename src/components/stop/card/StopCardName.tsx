import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { useCountdown, useGroupItem } from '@/composables'
import { useStop, useStopArrivals } from '@/composables/query'
import { MS_60_SECONDS } from '@/constants/time'

import { UBadge, UQueryState, UText } from '../../u'

export const StopCardName = () => {
  const { t } = useTranslation()
  const { code } = useGroupItem()

  const { query: arrivalsQuery } = useStopArrivals(code)
  const { query: stopQuery } = useStop(code)
  const { remaining } = useCountdown(arrivalsQuery.dataUpdatedAt, MS_60_SECONDS)

  return (
    <View className="shrink grow flex-row items-center gap-2">
      <UBadge
        label={stopQuery.data?.stop.name ?? code}
        variant="soft"
        size="lg"
        className="rounded-sm"
        icon="map-pin"
      />

      <Animated.View
        key={arrivalsQuery.isFetching ? 'loading' : 'text'}
        entering={FadeInDown}
        exiting={FadeOutUp}
        className="shrink overflow-hidden"
      >
        <UQueryState
          query={arrivalsQuery}
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
