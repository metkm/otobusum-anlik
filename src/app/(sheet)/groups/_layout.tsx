import { useLocalSearchParams } from 'expo-router'

import { Sheet } from '@/app/_layout'
import { LineContext } from '@/composables/useLine'

export const GroupsLayout = () => {
  const params = useLocalSearchParams()

  const addToGroup = params.addToGroup as string | undefined

  return (
    <LineContext value={addToGroup}>
      <Sheet
        screenOptions={{
          grabberOptions: {
            topMargin: 8,
            height: 4,
          },
          footerStyle: {
            paddingHorizontal: 8,
          },
        }}
      >
        <Sheet.Screen name="index" />
        <Sheet.Screen name="[groupId]" />
      </Sheet>
    </LineContext>
  )
}

export default GroupsLayout
