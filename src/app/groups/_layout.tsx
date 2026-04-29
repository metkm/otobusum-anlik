import { useCSSVariable } from 'uniwind'

import { Sheet } from '../_layout'

export const GroupsLayout = () => {
  const background = useCSSVariable('--background-color-default')

  return (
    <Sheet
      screenOptions={{
        grabberOptions: {
          topMargin: 8,
          height: 4,
        },
        backgroundColor: background as string,
      }}
    >
      <Sheet.Screen name="index" />
      <Sheet.Screen name="[groupId]" />
    </Sheet>
  )
}

export default GroupsLayout
