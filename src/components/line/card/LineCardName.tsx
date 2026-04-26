import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useCountdown, useLine, useLineBuses } from '@/composables'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'

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
        <UQueryState query={lineBusesQuery}>
          <UText className="text-xs text-muted font-medium">
            {`${remaining} sec to update`}
          </UText>
        </UQueryState>
      </Animated.View>
    </View>
  )
}
