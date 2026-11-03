import { View } from 'react-native'

import { SkeletonPulse } from './SkeletonPulse'

export const SkeletonStop = () => (
  <View className="gap-2">
    <SkeletonPulse className="h-48" />

    <View className="flex-row gap-2">
      <SkeletonPulse className="h-9.25 flex-1" />
      <SkeletonPulse className="h-9.25 flex-1" />
    </View>

    <View className="gap-2">
      <SkeletonPulse className="h-3.5 w-14" />
      <SkeletonPulse className="h-4.75 w-36" />
      <SkeletonPulse className="h-3.5 w-14" />
    </View>

    <View className="gap-1">
      <SkeletonPulse className="h-4 w-36" />

      <View className="flex-row flex-wrap gap-2">
        {[...Array(10).keys()].map((i) => (
          <SkeletonPulse
            key={i}
            className="h-9.5 w-12"
          />
        ))}
      </View>
    </View>
  </View>
)
