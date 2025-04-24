import { StatusBar, type StatusBarStyle, type StatusBarProps } from 'expo-status-bar'

import { useTheme } from '@/hooks/useTheme'

export const TheStatusBar = (props: StatusBarProps) => {
  const { mode } = useTheme()

  const style: StatusBarStyle = mode === 'dark' ? 'light' : 'dark'

  return <StatusBar style={style} animated translucent {...props} />
}
