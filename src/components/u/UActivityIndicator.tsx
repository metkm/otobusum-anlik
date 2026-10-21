import type { ComponentProps } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { withUniwind } from 'uniwind'

const StyledActivityIndicator = withUniwind(ActivityIndicator, {
  size: {
    fromClassName: 'sizeClassName',
    styleProperty: 'width',
  },
})

export const UActivityIndicator = (props: ComponentProps<typeof StyledActivityIndicator>) => (
  <View className="items-center justify-center">
    <StyledActivityIndicator
      colorClassName="accent-(--ui-text)"
      {...props}
    />
  </View>
)
