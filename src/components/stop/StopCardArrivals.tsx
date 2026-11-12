import { LegendList } from '@legendapp/list/react-native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useGroupItem } from '@/composables'
import { useStopArrivals } from '@/composables/query'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'

import { ThemeProvider } from '../ThemeProvider'
import { UBadge, UIcon, UQueryState, UText } from '../u'

export const StopCardArrivals = () => {
  const { t } = useTranslation()
  const { code } = useGroupItem()
  const { query } = useStopArrivals(code)

  return (
    <UQueryState query={query}>
      <LegendList
        data={query.data?.data}
        renderItem={({ item }) => (
          <Animated.View
            className="flex-row items-center gap-2 p-2"
            exiting={ExitScaleOut}
            entering={EnterScaleIn}
          >
            <UIcon
              name="bus-front"
              sizeClassName="size-6"
            />

            <View className="flex-1 gap-1">
              <ThemeProvider value={item.line_code}>
                <View className="flex-row items-center gap-2">
                  <UBadge label={item.line_code} />

                  <UIcon
                    name="accessibility"
                    sizeClassName="size-4"
                    colorClassName={item.features.accessible ? 'text-primary' : 'text-muted'}
                  />
                  <UIcon
                    name="usb"
                    sizeClassName="size-4"
                    colorClassName={item.features.usb_available ? 'text-primary' : 'text-muted'}
                  />
                  <UIcon
                    name="wifi"
                    sizeClassName="size-4"
                    colorClassName={item.features.wifi_available ? 'text-primary' : 'text-muted'}
                  />
                  <UIcon
                    name="air-vent"
                    sizeClassName="size-4"
                    colorClassName={item.features.ac_active ? 'text-primary' : 'text-muted'}
                  />
                  <UIcon
                    name="bike"
                    sizeClassName="size-4"
                    colorClassName={item.features.bicycle_rack ? 'text-primary' : 'text-muted'}
                  />
                </View>
              </ThemeProvider>

              <UText
                className="truncate"
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
        )}
        keyExtractor={(item) => item.door_no}
        getFixedItemSize={() => 67}
        className="flex-1"
        recycleItems
      />
    </UQueryState>
  )
}
