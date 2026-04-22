import { Sheet } from '../_layout'

import { LineContext } from '@/composables/useLine'

export const StopLayout = () => {
  return (
    <LineContext value="KM12">
      <Sheet>
        <Sheet.Screen name="[lineCode]/[stopCode]" />
      </Sheet>
    </LineContext>
  )
}

export default StopLayout
