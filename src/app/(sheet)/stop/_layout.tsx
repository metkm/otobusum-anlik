import { Sheet } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { useLocalSearchParams } from 'expo-router'

import { LineContext } from '@/composables/useLine'

export const StopLayout = () => {
  const searchParams = useLocalSearchParams()

  return (
    <LineContext value={searchParams.lineCode as string}>
      <Sheet>
        <Sheet.Screen name="[stopCode]" />
      </Sheet>
    </LineContext>
  )
}

export default StopLayout
