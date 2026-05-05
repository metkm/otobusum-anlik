import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useCountdown, useLine, useLineBuses, useLineTheme } from '@/composables'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'

export const LineCardName = () => {
  const { code } = useLine()
  const { query: lineBusesQuery } = useLineBuses()
  const { remaining } = useCountdown(lineBusesQuery.dataUpdatedAt, LINE_UPDATE_INTERVAL)
  const { t } = useTranslation()

  const theme = useLineTheme()
  const color = theme?.text({ variant: 'ghost' })

  return (
    <View className="flex-row items-center gap-2 shrink grow overflow-hidden">
      <UText
        className="font-bold text-lg"
        style={color}
      >
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
          <UText className="text-xs text-muted font-inter-medium">
            {t('updateCount', { count: remaining })}
          </UText>
        </UQueryState>
      </Animated.View>
    </View>
  )
}
