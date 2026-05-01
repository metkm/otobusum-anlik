import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { withUniwind } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from './u/UButton'

import { useMap } from '@/composables'
import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { useLineStore, useSettingsStore } from '@/stores'

const AnimatedGestureHandlerRootView = Animated.createAnimatedComponent(withUniwind(GestureHandlerRootView))

export const MapButtons = () => {
  const { map, camera } = useMap()

  const bearing = useSettingsStore(useShallow(state => state.bearing))
  const lines = useLineStore(useShallow(state => state.getLines()))
  const group = useLineStore(useShallow(state => state.getLineGroup()))
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))

  const bottomInset = useSharedValue(8)

  useEffect(() => {
    bottomInset.value = withSpring(
      lines.length < 1
        ? 8
        : lines.length < 2
          ? 200
          : 208,
    )
  }, [bottomInset, lines.length])

  const style = useAnimatedStyle(() => ({
    bottom: bottomInset.value,
  }))

  return (
    <AnimatedGestureHandlerRootView
      className="left-2 bottom-2 gap-2 absolute z-10 items-start"
      style={style}
      pointerEvents="box-none"
    >
      {bearing !== 0 && (
        <Animated.View entering={EnterScaleIn} exiting={ExitScaleOut}>
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
        </Animated.View>
      )}

      <UButton
        icon="search"
        to="/search"
        size="lg"
        color="neutral"
        style={{ elevation: 2 }}
        className="bg-default"
      />

      {lines.length > 1 && (
        <UButton
          icon="repeat"
          color="neutral"
          style={{ elevation: 2 }}
          size="lg"
          onPress={() => {
            lines.forEach(code => changeRouteDirection(code))
          }}
        />
      )}

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
  )
}
