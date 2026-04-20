import Lucide from '@react-native-vector-icons/lucide'
import { TextInputProps, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useCSSVariable } from 'uniwind'

import { UActivityIndicator } from './UActivityIndicator'

import { IconName } from '@/types/ui'
import { cn } from '@/utils/cn'

export const UInput = ({
  className,
  icon,
  loading,
  ...props
}: { icon?: IconName, loading?: boolean } & TextInputProps) => {
  const bgColor = useCSSVariable('--ui-text')

  const _icon = loading
    ? <UActivityIndicator />
    : icon
      ? <Lucide name={icon} size={20} color={bgColor as string} />
      : undefined

  return (
    <View className="relative">
      <TextInput
        className={cn('bg-muted rounded-md px-3', _icon ? 'pl-9' : undefined, className)}
        {...props}
      />

      <View className="absolute left-2 inset-y-0 justify-center">
        {_icon}
      </View>
    </View>
  )
}
