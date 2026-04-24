import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from './u/UButton'

import { useLineStore } from '@/stores/line'
import { cn } from '@/utils/cn'

export const MapButtons = () => {
  const lines = useLineStore(useShallow(state => state.lines()))
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))

  return (
    <Animated.View
      layout={LinearTransition}
      className={cn(
        'left-2 gap-2 absolute z-10',
        lines.length < 2
          ? lines.length < 1
            ? 'bottom-2'
            : 'bottom-50'
          : 'bottom-52',
      )}
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
