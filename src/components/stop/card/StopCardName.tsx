import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { UAnimatePresence } from '@/components/u/UAnimatePresence'
import { useCountdown, useGroupItem } from '@/composables'
import { useStop, useStopArrivals } from '@/composables/query'
import { MS_60_SECONDS } from '@/constants/time'

import { UBadge, UQueryState, UText } from '../../u'

export const StopCardName = () => {
  const { t } = useTranslation()
  const { code } = useGroupItem()

  const { query: stopQuery } = useStop(code)
  const { query: arrivalsQuery } = useStopArrivals(code)
  const { remaining } = useCountdown(arrivalsQuery.dataUpdatedAt, MS_60_SECONDS)

  return (
    <View className="shrink grow flex-row flex-wrap items-center gap-2">
      <UBadge
        label={stopQuery.data?.stop.name ?? code}
        variant="soft"
        size="lg"
        className="rounded-sm"
        icon="map-pin"
      />

      <UAnimatePresence key={arrivalsQuery.isFetching ? 'loading' : 'text'}>
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
      </UAnimatePresence>
    </View>
  )
}
