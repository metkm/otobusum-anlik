import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

export const UiActivityIndicator = (props: ActivityIndicatorProps) => {
  const { schemeColor } = useTheme()

  return (
    <ActivityIndicator
      color={schemeColor.onSurface}
      {...props}
    />
  )
}
