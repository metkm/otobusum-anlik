import { View } from 'react-native'

import { SkeletonPulse } from './SkeletonPulse'

export const SkeletonLineStops = () => {
  return (
    <View className="h-28 overflow-hidden gap-1 px-2">
      {[1, 2, 3].map(i => (
        <View key={i} className="flex-row items-center gap-2">
          <SkeletonPulse className="h-4 w-6.5" />
          <SkeletonPulse className="rounded-full size-8 border-2 bg-transparent border-black/50" />
          <SkeletonPulse className="h-4 grow" />
        </View>
      ))}
    </View>
  )
}
