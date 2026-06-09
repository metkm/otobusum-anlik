import { View } from 'react-native'

import { IconName, UIcon } from './UIcon'
import { UText } from './UText'

export const USheetHeader = ({ icon, title, description }: { icon?: IconName, title: string, description?: string }) => {
  return (
    <View className="p-2 pt-5 border-b border-b-muted">
      <View className="flex-row items-center justify-center gap-1">
        {icon && (
          <UIcon
            name={icon}
            sizeClassName="size-4"
          />
        )}

        <UText className="font-inter-semibold text-center">{title}</UText>
      </View>

      {description && (
        <UText className="text-xs text-muted text-center">{description}</UText>
      )}
    </View>
  )
}
