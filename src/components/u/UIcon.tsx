import Lucide from '@react-native-vector-icons/lucide'
import { ComponentProps } from 'react'
import { withUniwind } from 'uniwind'

import { cn } from '@/utils/cn'

export const StyledLucide = withUniwind(Lucide, {
  size: {
    fromClassName: 'sizeClassName',
    styleProperty: 'width',
  },
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'color',
  },
})

export type IconName = ComponentProps<typeof StyledLucide>['name']

export const UIcon = ({ sizeClassName, colorClassName, ...props }: ComponentProps<typeof StyledLucide>) => {
  return (
    <StyledLucide
      sizeClassName={cn('size-5', sizeClassName)}
      colorClassName={cn('text-default', colorClassName)}
      className={sizeClassName}
      {...props}
    />
  )
}
