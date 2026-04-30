import { ComponentProps } from 'react'
import { Switch } from 'react-native-gesture-handler'

export const USwitch = (props: ComponentProps<typeof Switch>) => {
  return (
    <Switch
      thumbColorClassName="accent-primary"
      trackColorOnClassName="accent-primary/50"
      trackColorOffClassName="accent-bg"
      {...props}
    />
  )
}
