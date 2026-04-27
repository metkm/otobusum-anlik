import { useLocalSearchParams } from 'expo-router'

import { Sheet } from '../_layout'

import { LineContext } from '@/composables/useLine'

export const StopLayout = () => {
  const searchParams = useLocalSearchParams()

  return (
    <LineContext value={searchParams.lineCode as string}>
      <Sheet>
        <Sheet.Screen name="[lineCode]/[stopCode]" />
      </Sheet>
    </LineContext>
  )
}

export default StopLayout
