import Lucide from '@react-native-vector-icons/lucide'
import { ComponentProps } from 'react'
import { withUniwind } from 'uniwind'

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

export const UIcon = (props: ComponentProps<typeof StyledLucide>) => {
  return <StyledLucide size={20} {...props} />
}
