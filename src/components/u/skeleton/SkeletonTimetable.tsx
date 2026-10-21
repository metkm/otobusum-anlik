import { View } from 'react-native'

import { SkeletonPulse } from './SkeletonPulse'

export const SkeletonTimetable = () => {
  const rows = []

  for (let index = 0; index < 10; index++) {
    rows.push(
      <SkeletonPulse
        key={index}
        className="h-8 w-full"
      />,
    )
  }

  return (
    <View className="flex flex-row gap-2 p-2">
      <View className="w-8 gap-2">{rows}</View>

      <View className="grow gap-2">{rows}</View>
    </View>
  )
}
