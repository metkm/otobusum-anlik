import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { type ViewProps } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { createAnimatedComponent } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useLineGroup, useMap } from '@/composables'
import { useGroupItemColorCarouselOffset } from '@/composables/useGropItemColorCarouselOffset'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore, useTransitStore } from '@/stores'
import { cn } from '@/utils/cn'

import { UButton } from '../u/UButton'

const AnimatedGestureHandlerRootView = createAnimatedComponent(GestureHandlerRootView)
const AnimatedUButton = createAnimatedComponent(UButton)

export const OverlayMapButtonsChangeDirection = () => {
  const { group } = useLineGroup()
  const { style } = useGroupItemColorCarouselOffset()

  if (!group || group.items.length < 2) {
    return
  }

  const onPress = () => {
    group.items.forEach((item) => useTransitStore.getState().changeRouteDirection(item.code))
  }

  return (
    <AnimatedGestureHandlerRootView
      layout={LayoutAnimationTransition}
      entering={EnterScaleIn}
      exiting={ExitScaleOut}
      style={{ display: 'flex' }}
    >
      <AnimatedUButton
        icon="repeat"
        color="neutral"
        style={{ elevation: 1, ...style }}
        size="lg"
        variant="subtle"
        className="ml-auto flex"
        onPress={onPress}
      />
    </AnimatedGestureHandlerRootView>
  )
}

export const OverlayMapButtonsGroup = () => {
  const { group } = useLineGroup()
  const { style } = useGroupItemColorCarouselOffset()

  return (
    <AnimatedGestureHandlerRootView
      layout={LayoutAnimationTransition}
      entering={EnterScaleIn}
      exiting={ExitScaleOut}
      style={{ display: 'flex', maxWidth: '75%' }}
    >
      <AnimatedUButton
        layout={LayoutAnimationTransition}
        className="overflow-hidden"
        icon="component"
        color="neutral"
        size="lg"
        variant="subtle"
        to={{ pathname: '/(sheet)/groups' }}
        label={group?.name}
        style={{ elevation: 1, ...style }}
      />
    </AnimatedGestureHandlerRootView>
  )
}

export const OverlayMapButtons = (props: ViewProps) => {
  const { map, camera } = useMap()
  const { style } = useGroupItemColorCarouselOffset()
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
        'p-2 gap-2 flex-wrap mt-auto',
        hideMap && 'flex-row',
        mapButtonsPlacement === 'left' ? 'mr-auto items-start' : 'ml-auto items-end justify-end',
      )}
      pointerEvents="box-none"
      {...props}
    >
      {(bearing !== 0 || pitch !== 0) && (
        <AnimatedGestureHandlerRootView
          layout={LayoutAnimationTransition}
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
          style={{ display: 'flex' }}
        >
          <AnimatedUButton
            icon="compass"
            size="lg"
            color="neutral"
            variant="subtle"
            style={{ elevation: 1, ...style }}
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
        </AnimatedGestureHandlerRootView>
      )}

      {!hideMap && (
        <AnimatedGestureHandlerRootView
          layout={LayoutAnimationTransition}
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
          style={{ display: 'flex' }}
        >
          <AnimatedUButton
            icon="radar"
            onPress={queryArea}
            size="lg"
            color="neutral"
            variant="subtle"
            style={{ elevation: 1, ...style }}
          />
        </AnimatedGestureHandlerRootView>
      )}

      <AnimatedGestureHandlerRootView
        layout={LayoutAnimationTransition}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ display: 'flex' }}
      >
        <AnimatedUButton
          icon="search"
          to={{ pathname: '/search' }}
          size="lg"
          color="neutral"
          variant="subtle"
          style={{ elevation: 1, ...style }}
        />
      </AnimatedGestureHandlerRootView>

      <OverlayMapButtonsChangeDirection />
      <OverlayMapButtonsGroup />
    </Animated.View>
  )
}
