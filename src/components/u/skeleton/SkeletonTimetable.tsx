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
      <View className="gap-2 w-8">
        {rows}
      </View>

      <View className="gap-2 grow">
        {rows}
      </View>
    </View>
  )
}
