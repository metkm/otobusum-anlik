import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { UBadge, UQueryState, UText } from '@/components/u'
import { UAnimatePresence } from '@/components/u/UAnimatePresence'
import { useCountdown } from '@/composables'
import { useLineBuses } from '@/composables/query'
import { useGroupItem } from '@/composables/useGroupItem'

export const LineCardName = () => {
  const { code } = useGroupItem()
  const { query: lineBusesQuery } = useLineBuses()

  const duration = lineBusesQuery.data
    ? lineBusesQuery.data.next_poll - lineBusesQuery.dataUpdatedAt
    : undefined

  const { remaining } = useCountdown(lineBusesQuery.dataUpdatedAt, duration)
  const { t } = useTranslation()

  return (
    <View className="shrink grow flex-row flex-wrap items-center gap-2 overflow-hidden">
      <UBadge
        label={code}
        variant="soft"
        size="lg"
        className="rounded-sm"
        icon="bus-front"
      />

      <UAnimatePresence key={lineBusesQuery.isFetching ? 'loading' : 'text'}>
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
      </UAnimatePresence>
    </View>
  )
}
