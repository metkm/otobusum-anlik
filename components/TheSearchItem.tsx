import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { memo, useCallback, useRef } from 'react'

import { UiText } from './ui/UiText'
import { LineGroups } from './lines/groups/LineGroups'
import { UiLineCode } from './ui/UiLineCode'
import { UiButton } from './ui/UiButton'

import { addLine, addLineToGroup } from '@/stores/lines'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LineGroup } from '@/types/lineGroup'
import { BusLine, BusStop } from '@/types/bus'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { isStop } from '@/utils/isStop'

interface Props extends TouchableOpacityProps {
  item: BusStop | BusLine
}

export const TheSearchItem = memo(function SearchItem({ item, ...props }: Props) {
  const bottomSheetModal = useRef<BottomSheetModal>(null)

  const handlePress = useCallback(() => {
    if (isStop(item)) {
      router.navigate({
        pathname: '/(search)/stop/[stopId]',
        params: {
          stopId: item.stop_code,
        },
      })
    } else {
      addLine(item.code)
    }
  }, [item])

  const handleAddPress = () => {
    bottomSheetModal.current?.present()
  }

  const handleGroupSelect = useCallback((group: LineGroup) => {
    if (isStop(item)) return

    addLineToGroup(group.id, item.code)
    bottomSheetModal.current?.close()
  }, [item])

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      {...props}
    >
      <View style={styles.title}>
        {isStop(item)
          ? (
              <>
                <UiLineCode code="">
                  <MaterialCommunityIcons name="bus-stop" size={20} />
                </UiLineCode>
                <UiText>{item.stop_name}</UiText>
              </>
            )
          : (
              <>
                <UiLineCode code={item.code} />
                <UiText>{item.title}</UiText>
              </>
            )}
      </View>

      {
        !isStop(item)
        && (
          <LineGroups ref={bottomSheetModal} onPressGroup={handleGroupSelect}>
            <UiButton icon="add-circle-outline" onPress={handleAddPress} />
          </LineGroups>
        )
      }
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
})
