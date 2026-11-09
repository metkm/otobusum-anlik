import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { type ViewProps } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { createAnimatedComponent } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useLineGroup, useMap } from '@/composables'
import { EnterScaleIn, ExitScaleOut, LayoutAnimationTransition } from '@/constants/animation'
import { useLineStore, useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

import { UButton } from './u/UButton'

const AnimatedGestureHandlerRootView = createAnimatedComponent(GestureHandlerRootView)
const AnimatedUButton = createAnimatedComponent(UButton)

export const MapButtonsChangeDirection = () => {
  const { codes } = useLineGroup()

  if (codes.length < 2) {
    return
  }

  const onPress = () => {
    codes.forEach((code) => useLineStore.getState().changeRouteDirection(code))
  }

  return (
    <AnimatedGestureHandlerRootView
      layout={LayoutAnimationTransition}
      entering={EnterScaleIn}
      exiting={ExitScaleOut}
      style={{ display: 'flex' }}
    >
      <UButton
        icon="repeat"
        color="neutral"
        style={{ elevation: 2 }}
        size="lg"
        variant="subtle"
        className="ml-auto flex"
        onPress={onPress}
      />
    </AnimatedGestureHandlerRootView>
  )
}

export const MapButtonsGroup = () => {
  const { group } = useLineGroup()

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
        to={{ pathname: '(sheet)/groups/index' }}
        label={group?.name}
        style={{ elevation: 2 }}
      />
    </AnimatedGestureHandlerRootView>
  )
}

export const MapButtons = (props: ViewProps) => {
  const { map, camera } = useMap()
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
        'p-2 gap-2 flex-wrap',
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
          <UButton
            icon="compass"
            size="lg"
            color="neutral"
            variant="subtle"
            style={{ elevation: 1 }}
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
          <UButton
            icon="radar"
            onPress={queryArea}
            size="lg"
            color="neutral"
            variant="subtle"
            style={{ elevation: 1 }}
          />
        </AnimatedGestureHandlerRootView>
      )}

      <AnimatedGestureHandlerRootView
        layout={LayoutAnimationTransition}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ display: 'flex' }}
      >
        <UButton
          icon="search"
          to={{ pathname: 'search' }}
          size="lg"
          color="neutral"
          variant="subtle"
          style={{ elevation: 1 }}
        />
      </AnimatedGestureHandlerRootView>

      <MapButtonsChangeDirection />
      <MapButtonsGroup />
    </Animated.View>
  )
}
