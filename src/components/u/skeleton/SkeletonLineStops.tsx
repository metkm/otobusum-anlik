import { View } from 'react-native'

import { SkeletonPulse } from './SkeletonPulse'

export const SkeletonLineStops = () => {
  return (
    <View className="h-28 gap-1 overflow-hidden px-2">
      {[1, 2, 3].map((i) => (
        <View key={i} className="flex-row items-center gap-2">
          <SkeletonPulse className="h-4 w-6.5" />
          <SkeletonPulse className="size-8 rounded-full border-2 border-black/50 bg-transparent" />
          <SkeletonPulse className="h-4 grow" />
        </View>
      ))}
    </View>
  )
}
