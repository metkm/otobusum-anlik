import { Platform, ToastAndroid } from 'react-native'

export const notify = (message: string) => {
  if (Platform.OS !== 'android') return
  ToastAndroid.show(message, ToastAndroid.SHORT)
}
