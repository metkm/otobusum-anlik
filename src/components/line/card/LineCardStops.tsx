import { View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { SkeletonLineStops } from '@/components/u/skeleton/SkeletonLineStops'
import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useLineStops, useLineBuses, useLineTheme, useMap } from '@/composables'
import { BusStop } from '@/types/bus'

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

  const border = theme?.border({ variant: 'solid' })
  const color = theme?.text({ variant: 'ghost' })
  const background = theme?.backgroundWithColor({ variant: 'ghost' })

  const closestBus = buses.find(b => b.closest_stop_code === item.code)

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
        className="items-center justify-center size-9 rounded-full border-2 border-muted"
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

export const LineCardStops = () => {
  const { query: lineStopsQuery } = useLineStops()

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
        className="h-28"
        contentContainerClassName="px-2 gap-2"
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        fadingEdgeLength={10}
        windowSize={2}
      />
    </UQueryState>
  )
}
