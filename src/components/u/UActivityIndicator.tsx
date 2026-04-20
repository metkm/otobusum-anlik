import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'
import { useCSSVariable } from 'uniwind'

export const UActivityIndicator = (props: ActivityIndicatorProps) => {
  const bgColor = useCSSVariable('--ui-text')

  return (
    <ActivityIndicator
      color={bgColor as string}
      {...props}
    />
  )
}
