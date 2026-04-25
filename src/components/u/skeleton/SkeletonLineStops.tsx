import { View } from 'react-native'

import { SkeletonPulse } from './SkeletonPulse'

export const SkeletonLineStops = () => {
  return (
    <View className="gap-2 px-2">
      {[1, 2].map(i => (
        <View key={i} className="flex-row items-center gap-2">
          <SkeletonPulse className="h-6 w-6.5" />
          <SkeletonPulse className="rounded-full size-10 border-2 bg-transparent border-black/50" />
          <SkeletonPulse className="h-6 grow" />
        </View>
      ))}
    </View>
  )
}
