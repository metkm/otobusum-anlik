import { TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import { cn } from '@/utils/cn'

export const UInput = ({
  className,
  ...props
}: TextInputProps) => {
  return (
    <TextInput
      className={cn('bg-muted rounded-md px-3', className)}
      {...props}
    />
  )
}
