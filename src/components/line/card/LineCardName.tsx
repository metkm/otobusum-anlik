import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useCountdown, useLine, useLineBuses } from '@/composables'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import { i18n } from '@/translations/i18n'

export const LineCardName = () => {
  const { code } = useLine()
  const { query: lineBusesQuery } = useLineBuses()
  const { remaining } = useCountdown(lineBusesQuery.dataUpdatedAt, LINE_UPDATE_INTERVAL)

  return (
    <View className="flex-row items-center gap-2 shrink grow overflow-hidden">
      <UText className="font-bold text-lg">{code}</UText>

      <Animated.View
        key={lineBusesQuery.isFetching ? 'loading' : 'text'}
        entering={FadeInDown}
        exiting={FadeOutUp}
        className="shrink"
      >
        <UQueryState
          query={lineBusesQuery}
          errorMessage={i18n.t('errorGettingBusLocations')}
        >
          <UText className="text-xs text-muted font-inter-medium">
            {i18n.t('updateCount', { count: remaining })}
          </UText>
        </UQueryState>
      </Animated.View>
    </View>
  )
}
