import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { type ViewProps } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { createAnimatedComponent, LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useLineGroup, useMap } from '@/composables'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useLineStore, useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

import { UButton } from './u/UButton'

const AnimatedGestureHandlerRootView = createAnimatedComponent(GestureHandlerRootView)

export const MapButtons = (props: ViewProps) => {
  const { map, camera } = useMap()
  const { group, codes } = useLineGroup()
  const navigation = useTrueSheetNavigation()

  const bearing = useSettingsStore(useShallow((state) => state.bearing))
  const pitch = useSettingsStore(useShallow((state) => state.pitch))
  const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const changeRouteDirection = useLineStore(useShallow((state) => state.changeRouteDirection))
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
      layout={LinearTransition}
      className={cn(
        'p-2 gap-2',
        lineCardExpanded || hideMap ? 'flex-row' : undefined,
        mapButtonsPlacement === 'left' ? 'mr-auto items-start' : 'ml-auto items-end justify-end',
      )}
      pointerEvents="box-none"
      {...props}
    >
      {(bearing !== 0 || pitch !== 0) && (
        <AnimatedGestureHandlerRootView
          layout={LinearTransition}
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
          style={{ width: 'auto' }}
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

      <AnimatedGestureHandlerRootView
        layout={LinearTransition}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
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

      <AnimatedGestureHandlerRootView
        layout={LinearTransition}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ width: 'auto' }}
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

      {codes.length > 1 && (
        <AnimatedGestureHandlerRootView
          layout={LinearTransition}
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
        >
          <UButton
            icon="repeat"
            color="neutral"
            style={{ elevation: 2 }}
            size="lg"
            variant="subtle"
            onPress={() => {
              codes.forEach((code) => changeRouteDirection(code))
            }}
          />
        </AnimatedGestureHandlerRootView>
      )}

      <AnimatedGestureHandlerRootView
        layout={LinearTransition}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ maxWidth: '75%' }}
      >
        <UButton
          icon="component"
          color="neutral"
          size="lg"
          variant="subtle"
          to={{ pathname: '(sheet)/groups/index' }}
          label={group?.name}
          style={{ elevation: 2 }}
        />
      </AnimatedGestureHandlerRootView>
    </Animated.View>
  )
}
