import { ActivityIndicator } from 'react-native'
import { useCSSVariable } from 'uniwind'

export const UActivityIndicator = () => {
  const bgColor = useCSSVariable('--ui-text')

  return <ActivityIndicator color={bgColor as string} />
}
