import { ComponentProps } from 'react'
import { ActivityIndicator } from 'react-native'
import { withUniwind } from 'uniwind'

const StyledActivityIndicator = withUniwind(ActivityIndicator)

export const UActivityIndicator = (props: ComponentProps<typeof StyledActivityIndicator>) => {
  return (
    <StyledActivityIndicator
      colorClassName="accent-(--ui-text)"
      {...props}
    />
  )
}
