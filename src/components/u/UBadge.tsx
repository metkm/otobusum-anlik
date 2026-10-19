import { hexFromArgb, type Theme } from '@material/material-color-utilities'
import Lucide from '@react-native-vector-icons/lucide'
import { ComponentProps } from 'react'
import { View } from 'react-native'

import { UIcon } from './UIcon'
import { UText } from './UText'

export const UBadge = ({
  label,
  theme,
  icon,
}: {
  label?: string
  theme?: Theme
  icon?: ComponentProps<typeof Lucide>['name']
}) => {
  const backgroundColor = theme ? hexFromArgb(theme.schemes.dark.primary) : undefined
  const color = theme ? hexFromArgb(theme.schemes.dark.onPrimary) : undefined

  return (
    <View
      className="px-2 py-1 flex-row bg-muted rounded-full"
      style={color ? { backgroundColor } : undefined}
    >
      {icon && (
        <UIcon
          name={icon}
          sizeClassName="size-4"
        />
      )}

      {label && (
        <UText
          className="font-inter-semibold text-xs"
          style={color ? { color } : undefined}
        >
          {label}
        </UText>
      )}
    </View>
  )
}
