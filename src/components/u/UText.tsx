import { Text, type TextProps } from 'react-native'

import { cn } from '@/utils/cn'

export const UText = ({ className, ...props }: TextProps) => (
  <Text
    className={cn('font-inter text-default leading-tight', className)}
    {...props}
  />
)
