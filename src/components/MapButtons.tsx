import { ViewProps, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createAnimatedComponent } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useMap, useLineGroup } from '@/composables'
import { EnterScaleIn, ExitScaleOut, ItemLayoutAnimation } from '@/constants/animation'
import { useLineStore, useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

import { UButton } from './u/UButton'

const AnimatedGestureHandlerRootView = createAnimatedComponent(GestureHandlerRootView)

export const MapButtons = (props: ViewProps) => {
  const { map, camera } = useMap()
  const { group, codes } = useLineGroup()

  const bearing = useSettingsStore(useShallow((state) => state.bearing))
  const pitch = useSettingsStore(useShallow((state) => state.pitch))
  const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const changeRouteDirection = useLineStore(useShallow((state) => state.changeRouteDirection))
  const mapButtonsPlacement = useSettingsStore(useShallow((state) => state.mapButtonsPlacement))

  return (
    <View
      className={cn(
        'p-2 gap-2',
        lineCardExpanded || hideMap ? 'flex-row' : undefined,
        mapButtonsPlacement === 'left' ? 'items-start justify-start' : 'items-end justify-end',
      )}
      pointerEvents="box-none"
      {...props}
    >
      {(bearing !== 0 || pitch !== 0) && (
        <AnimatedGestureHandlerRootView
          layout={ItemLayoutAnimation}
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
          style={{ width: 'auto' }}
        >
          <UButton
            icon="compass"
            size="lg"
            color="neutral"
            style={{ elevation: 1 }}
            onPress={async () => {
              const center = await map.current?.getCenter()
              if (!center) return

              camera.current?.easeTo({
                center,
                bearing: 0,
                pitch: 0,
              })
            }}
          />
        </AnimatedGestureHandlerRootView>
      )}

      <AnimatedGestureHandlerRootView
        layout={ItemLayoutAnimation}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ width: 'auto' }}
      >
        <UButton
          icon="radar"
          to="/markers/nearby"
          size="lg"
          color="neutral"
          style={{ elevation: 1 }}
        />
      </AnimatedGestureHandlerRootView>

      <AnimatedGestureHandlerRootView
        layout={ItemLayoutAnimation}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ width: 'auto' }}
      >
        <UButton
          icon="search"
          to="/search"
          size="lg"
          color="neutral"
          style={{ elevation: 1 }}
        />
      </AnimatedGestureHandlerRootView>

      {codes.length > 1 && (
        <AnimatedGestureHandlerRootView
          layout={ItemLayoutAnimation}
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
          style={{ width: 'auto' }}
        >
          <UButton
            icon="repeat"
            color="neutral"
            style={{ elevation: 2 }}
            size="lg"
            onPress={() => {
              codes.forEach((code) => changeRouteDirection(code))
            }}
          />
        </AnimatedGestureHandlerRootView>
      )}

      <AnimatedGestureHandlerRootView
        layout={ItemLayoutAnimation}
        entering={EnterScaleIn}
        exiting={ExitScaleOut}
        style={{ maxWidth: '75%' }}
      >
        <UButton
          icon="component"
          color="neutral"
          style={{ elevation: 1 }}
          size="lg"
          to="/groups"
          label={group?.name}
        />
      </AnimatedGestureHandlerRootView>
    </View>
  )
}
