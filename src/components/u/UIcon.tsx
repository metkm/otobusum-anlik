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

export const UIcon = ({ sizeClassName, ...props }: ComponentProps<typeof StyledLucide>) => {
  return (
    <StyledLucide
      sizeClassName={cn('size-4', sizeClassName)}
      className={sizeClassName}
      {...props}
    />
  )
}
