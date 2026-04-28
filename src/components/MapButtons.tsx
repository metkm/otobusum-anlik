import { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from './u/UButton'

import { useLineStore } from '@/stores'
import { cn } from '@/utils/cn'

export const MapButtons = () => {
  const lines = useLineStore(useShallow(state => state.getLines()))
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))
  const group = useLineStore(useShallow(state => state.getLineGroup()))

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
    <Animated.View
      className={cn('left-2 gap-2 absolute z-10 items-start')}
      style={style}
    >
      <UButton
        icon="search"
        to="/search"
        size="lg"
        color="neutral"
        style={{ elevation: 5 }}
      />

      {lines.length > 1 && (
        <UButton
          icon="repeat"
          color="neutral"
          style={{ elevation: 5 }}
          size="lg"
          onPress={() => {
            lines.forEach(code => changeRouteDirection(code))
          }}
        />
      )}

      <UButton
        icon="component"
        color="neutral"
        style={{ elevation: 5 }}
        size="lg"
        to="/groups"
        label={group?.name}
      />
    </Animated.View>
  )
}

// <View className="ml-2 mb-2 gap-2">
//   <UButton
//     icon="search"
//     to="/search"
//     size="lg"
//     color="neutral"
//     style={{ elevation: 5 }}
//   />

//   <UButton
//     icon="repeat"
//     color="neutral"
//     style={{ elevation: 5 }}
//     size="lg"
//     onPress={changeAllRouteDirections}
//   />
// </View>
