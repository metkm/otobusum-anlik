import { t } from 'i18next'
import { View } from 'react-native'
import Animated, { LinearTransition, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useDebouncedCallback } from 'use-debounce'
import { useShallow } from 'zustand/react/shallow'

import { SkeletonLineStops } from '@/components/u/skeleton/SkeletonLineStops'
import { UButton } from '@/components/u/UButton'
import { UEmpty } from '@/components/u/UEmpty'
import { UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useLineStops, useLineBuses, useLineTheme, useMap } from '@/composables'
import { useSettingsStore } from '@/stores'
import { BusStop } from '@/types/bus'
import { getClosestPoint } from '@/utils/getClosestPoint'

const ErrorState = ({ message }: { message?: string }) => {
  return (
    <View className="h-22 items-center justify-center">
      <UText className="text-error font-inter-medium text-xs">
        {message}
      </UText>
    </View>
  )
}

const StopItem = ({ item, index }: { item: BusStop, index: number }) => {
  const theme = useLineTheme()
  const { buses } = useLineBuses()
  const { camera } = useMap()
  const { query: lineStopsQuery } = useLineStops()

  const border = theme?.border({ variant: 'solid' })
  const color = theme?.text({ variant: 'ghost' })
  const background = theme?.backgroundWithColor({ variant: 'ghost' })

  const closestBus = buses.find((bus) => {
    if (!lineStopsQuery.data)
      return false

    const closestStop = getClosestPoint(bus, lineStopsQuery.data)
    return closestStop?.id && closestStop.id === item.id
  })

  const goToBus = () => {
    if (!closestBus)
      return

    camera.current?.flyTo({
      center: [closestBus.lng, closestBus.lat],
      zoom: 13,
      duration: 1000,
    })
  }

  return (
    <View className="flex-row items-center gap-2">
      <UText className="w-6.5 text-center font-inter-medium">{index + 1}</UText>

      <View
        className="items-center justify-center size-8 rounded-full border-2 border-muted"
        style={border}
      >
        {closestBus && (
          <UIcon
            name="bus-front"
            color={background?.color}
            size={16}
          />
        )}
      </View>

      <UText
        className="text-xs truncate shrink"
        numberOfLines={2}
        style={color}
      >
        {item.name}
      </UText>

      {closestBus && (
        <UButton
          icon="locate"
          className="ml-auto"
          variant="soft"
          onPress={goToBus}
        />
      )}
    </View>
  )
}

const COLLAPSED = 112
const EXPANDED = 192

export const LineCardStops = () => {
  const expandStopsWhenScrolled = useSettingsStore(useShallow(state => state.expandStopsWhenScrolled))
  const { query: lineStopsQuery } = useLineStops()
  const containerHeight = useSharedValue(COLLAPSED)

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }))

  const debouncedMomentumScrollEnd = useDebouncedCallback(() => {
    if (!expandStopsWhenScrolled && containerHeight.value !== EXPANDED)
      return
    containerHeight.value = COLLAPSED
  }, 1500)

  if (lineStopsQuery.data && lineStopsQuery.data.length < 1) {
    return (
      <UEmpty
        title={t('emptyStops')}
        icon="bus"
        className="grow"
      />
    )
  }

  const onScrollBeginDrag = () => {
    if (!expandStopsWhenScrolled)
      return
    containerHeight.value = EXPANDED
  }

  return (
    <UQueryState
      query={lineStopsQuery}
      loading={() => <SkeletonLineStops />}
      error={error => <ErrorState message={error.message} />}
    >
      <Animated.FlatList
        layout={LinearTransition}
        data={lineStopsQuery.data || []}
        renderItem={({ item, index }) => <StopItem item={item} index={index} />}
        contentContainerClassName="px-2 gap-2"
        initialNumToRender={3}
        fadingEdgeLength={10}
        windowSize={6}
        style={containerStyle}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={debouncedMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          index,
          length: 32,
          offset: 32 * index,
        })}
        directionalLockEnabled
      />
    </UQueryState>
  )
}
