import { ViewProps, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { createAnimatedComponent, LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from './u/UButton'

import { useMap } from '@/composables'
import { useLines } from '@/composables/useLines'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useFilterStore, useLineStore, useSettingsStore } from '@/stores'
import { cn } from '@/utils/cn'

const AnimatedGestureHandlerRootView = createAnimatedComponent(GestureHandlerRootView)

export const MapButtons = (props: ViewProps) => {
  const { map, camera } = useMap()

  const lines = useLines()
  const city = useFilterStore(useShallow(state => state.city))
  const group = useLineStore(useShallow(state => state.lines[city].find(x => x.id === state.groupId[city])))

  const bearing = useSettingsStore(useShallow(state => state.bearing))
  const lineCardExpanded = useSettingsStore(useShallow(state => state.lineCardExpanded))
  const hideMap = useSettingsStore(useShallow(state => state.hideMap))
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))

  return (
    <View
      className={cn(
        'pl-2 gap-2',
        (lineCardExpanded || hideMap) ? 'flex-row' : 'items-start',
      )}
      pointerEvents="box-none"
      {...props}
    >
      {bearing !== 0 && (
        <Animated.View
          entering={EnterScaleIn}
          exiting={ExitScaleOut}
        >
          <AnimatedGestureHandlerRootView
            layout={LinearTransition}
            style={{ width: 'auto' }}
          >
            <UButton
              icon="compass"
              size="lg"
              color="neutral"
              style={{ elevation: 2 }}
              className="bg-default"
              onPress={async () => {
                const center = await map.current?.getCenter()
                if (!center)
                  return

                camera.current?.easeTo({
                  center,
                  bearing: 0,
                })
              }}
            />
          </AnimatedGestureHandlerRootView>
        </Animated.View>
      )}

      <AnimatedGestureHandlerRootView
        layout={LinearTransition}
        style={{ width: 'auto' }}
      >
        <UButton
          icon="search"
          to="/search"
          size="lg"
          color="neutral"
          style={{ elevation: 2 }}
          className="bg-default"
        />
      </AnimatedGestureHandlerRootView>

      {lines.length > 1 && (
        <AnimatedGestureHandlerRootView
          layout={LinearTransition}
          style={{ width: 'auto' }}
        >
          <UButton
            icon="repeat"
            color="neutral"
            style={{ elevation: 2 }}
            size="lg"
            onPress={() => {
              lines.forEach(code => changeRouteDirection(code))
            }}
            className="bg-default"
          />
        </AnimatedGestureHandlerRootView>
      )}

      <AnimatedGestureHandlerRootView
        layout={LinearTransition}
        style={{ width: 'auto' }}
      >
        <UButton
          icon="component"
          color="neutral"
          style={{ elevation: 2 }}
          size="lg"
          to="/groups"
          label={group?.name}
          className="bg-default"
        />
      </AnimatedGestureHandlerRootView>
    </View>
  )
}
