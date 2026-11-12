import { AnimatedLegendList } from '@legendapp/list/reanimated'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useCardListHeight, useGroupItem } from '@/composables'
import { useStopArrivals } from '@/composables/query'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import type { StopArrival } from '@/types/stop'

import { ThemeProvider } from '../ThemeProvider'
import { UBadge, UIcon, UQueryState, UText } from '../u'

const StopCardArrivalsItem = ({ item }: { item: StopArrival }) => {
  const { t } = useTranslation()

  return (
    <Animated.View
      className="flex-row items-center gap-2 p-2"
      exiting={ExitScaleOut}
      entering={EnterScaleIn}
    >
      <View className="flex-1 gap-1">
        <ThemeProvider value={item.line_code}>
          <View className="flex-row items-center gap-2">
            <UBadge
              label={item.line_code}
              icon="bus-front"
            />

            <UIcon
              name="accessibility"
              sizeClassName="size-4"
              colorClassName={item.features.accessible ? 'accent-primary' : 'accent-muted'}
            />
            <UIcon
              name="usb"
              sizeClassName="size-4"
              colorClassName={item.features.usb_available ? 'accent-primary' : 'accent-muted'}
            />
            <UIcon
              name="wifi"
              sizeClassName="size-4"
              colorClassName={item.features.wifi_available ? 'accent-primary' : 'accent-muted'}
            />
            <UIcon
              name="air-vent"
              sizeClassName="size-4"
              colorClassName={item.features.ac_active ? 'accent-primary' : 'accent-muted'}
            />
            <UIcon
              name="bike"
              sizeClassName="size-4"
              colorClassName={item.features.bicycle_rack ? 'accent-primary' : 'accent-muted'}
            />
          </View>
        </ThemeProvider>

        <UText
          className="font-inter-medium truncate text-sm"
          numberOfLines={1}
        >
          {item.line_name}
        </UText>
      </View>

      <View className="ml-auto">
        <UText className="font-inter-medium text-right">
          {t('arrivingMinutes', { min: item.minutes_left })}
        </UText>

        <UText className="text-muted font-inter-medium text-sm">{t('arrivingIn')}</UText>
      </View>
    </Animated.View>
  )
}

export const StopCardArrivals = () => {
  const { code } = useGroupItem()
  const { query } = useStopArrivals(code)
  const { onScroll, style } = useCardListHeight()

  return (
    <UQueryState
      query={query}
      useIsLoading
    >
      <AnimatedLegendList
        data={query.data?.data}
        renderItem={({ item }) => <StopCardArrivalsItem item={item} />}
        keyExtractor={(item) => item.door_no}
        getFixedItemSize={() => 67}
        className="basis-0"
        onScroll={onScroll}
        // @ts-expect-error
        style={style}
        recycleItems
      />
    </UQueryState>
  )
}
