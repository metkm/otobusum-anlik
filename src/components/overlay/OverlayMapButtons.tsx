import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { type ViewProps } from 'react-native'
import Animated, { createAnimatedComponent } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useLineGroup, useMap } from '@/composables'
import { useGroupItemColorCarouselOffset } from '@/composables/useGroupItemColorCarouselOffset'
import { LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore, useTransitStore } from '@/stores'
import { cn } from '@/utils/cn'

import { UNativeGestureHandlerRootView } from '../u/native/UNativeGestureHandlerRootView'
import { UButton } from '../u/UButton'

// const AnimatedGestureHandlerRootView = createAnimatedComponent(GestureHandlerRootView)
const AnimatedUButton = createAnimatedComponent(UButton)

export const OverlayMapButtonsChangeDirection = () => {
  const { group } = useLineGroup()
  const { backgroundColor } = useGroupItemColorCarouselOffset()

  if (!group || group.items.length < 2) {
    return
  }

  const onPress = () => {
    group.items.forEach((item) => useTransitStore.getState().changeRouteDirection(item.code))
  }

  return (
    <UNativeGestureHandlerRootView className="shrink-0">
      <AnimatedUButton
        icon="repeat"
        color="neutral"
        style={{ backgroundColor, elevation: 1 }}
        size="lg"
        variant="subtle"
        className="ml-auto flex"
        onPress={onPress}
      />
    </UNativeGestureHandlerRootView>
  )
}

// export const OverlayMapButtonsGroup = () => {
//   const { group } = useLineGroup()
//   const { backgroundColor } = useGroupItemColorCarouselOffset()

//   return (
//     <UNativeGestureHandlerRootView className="max-w-lg">
//       <AnimatedUButton
//         className="overflow-hidden"
//         icon="component"
//         color="neutral"
//         size="lg"
//         variant="subtle"
//         to={{ pathname: '/(sheet)/groups' }}
//         label={group?.name}
//         style={{ backgroundColor, elevation: 1 }}
//       />
//     </UNativeGestureHandlerRootView>
//   )
// }

export const OverlayMapButtons = (props: ViewProps) => {
  const { map, camera } = useMap()
  const { backgroundColor } = useGroupItemColorCarouselOffset()
  const navigation = useTrueSheetNavigation()

  const bearing = useSettingsStore(useShallow((state) => state.bearing))
  const pitch = useSettingsStore(useShallow((state) => state.pitch))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const mapButtonsPlacement = useSettingsStore(useShallow((state) => state.mapButtonsPlacement))

  const queryArea = async () => {
    if (!map.current) {
      return
    }

    const center = await map.current?.getCenter()

    navigation.navigate('(sheet)/markers/nearby', {
      lat: center[1],
      lng: center[0],
    })
  }

  return (
    <Animated.View
      layout={LayoutAnimationTransition}
      className={cn(
        'gap-2 flex-wrap p-2 mt-auto',
        hideMap && 'flex-row',
        mapButtonsPlacement === 'left' ? 'mr-auto items-start' : 'ml-auto items-end justify-end',
      )}
      pointerEvents="box-none"
      {...props}
    >
      {(bearing !== 0 || pitch !== 0) && (
        <UNativeGestureHandlerRootView className="shrink-0">
          <AnimatedUButton
            icon="compass"
            size="lg"
            color="neutral"
            variant="subtle"
            style={{ backgroundColor, elevation: 1 }}
            onPress={async () => {
              const center = await map.current?.getCenter()
              if (!center) {
                return
              }

              camera.current?.easeTo({
                bearing: 0,
                center,
                pitch: 0,
              })
            }}
          />
        </UNativeGestureHandlerRootView>
      )}

      {!hideMap && (
        <UNativeGestureHandlerRootView className="shrink-0">
          <AnimatedUButton
            icon="radar"
            onPress={queryArea}
            size="lg"
            color="neutral"
            variant="subtle"
            style={{ backgroundColor, elevation: 1 }}
          />
        </UNativeGestureHandlerRootView>
      )}

      <OverlayMapButtonsChangeDirection />
    </Animated.View>
  )
}
