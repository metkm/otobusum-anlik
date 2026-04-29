import React from 'react'
import { Text, TextProps } from 'react-native'

import { cn } from '@/utils/cn'

export const UText = ({ className, ...props }: TextProps) => {
  return (
    <Text
      className={cn(
        'font-inter text-default',
        className,
      )}
      {...props}
    />
  )
}
