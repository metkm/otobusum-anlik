import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from './u/UButton'

import { useLineStore } from '@/stores/line'

export const MapButtons = () => {
  const lines = useLineStore(useShallow(state => state.lines()))
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))

  return (
    <View className="ml-2 mb-2 gap-2">
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
    </View>
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
