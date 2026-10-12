import { ReactNode } from 'react'
import { View } from 'react-native'

import { IconName, UIcon } from './UIcon'
import { UText } from './UText'

export const USheetHeader = ({ icon, title, description, children }: { icon?: IconName, title: string, description?: string, children?: ReactNode }) => {
  return (
    <View className="p-3 pt-9 gap-2 flex-row items-center justify-between border-b border-b-muted">
      <View className="flex-row items-center gap-2">
        {icon && (
          <UIcon
            name={icon}
            sizeClassName="size-5.5"
          />
        )}

        <View>
          <UText className="font-inter-semibold">{title}</UText>

          {description && (
            <UText className="text-xs text-muted">{description}</UText>
          )}
        </View>
      </View>

      {children}
    </View>
  )
}
