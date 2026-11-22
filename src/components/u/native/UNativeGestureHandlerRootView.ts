import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createAnimatedComponent } from 'react-native-reanimated'
import { withUniwind } from 'uniwind'

export const UNativeGestureHandlerRootView = withUniwind(GestureHandlerRootView)
export const UAnimatedNativeGestureHandlerRootView = withUniwind(
  createAnimatedComponent(GestureHandlerRootView),
)
