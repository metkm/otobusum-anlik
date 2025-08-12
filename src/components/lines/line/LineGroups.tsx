import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ReactNode, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheet, UiSheetProps } from '@/components/ui/UiSheet'
import { UiText } from '@/components/ui/UiText'

import { LineGroupsItem } from './LineGroupsItem'

import { selectGroup, useFiltersStore } from '@/stores/filters'
import { addLineToGroup, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsTypeAddProps {
  type: 'add'
  lineCode: string
}

interface LineGroupsTypeSelectProps {
  type: 'select'
  lineCode?: string
}

interface LineGroupsBaseProps {
  trigger?: ReactNode
  onGroupPress?: (group: LineGroup) => void
  sheetProps?: Omit<UiSheetProps, 'children'>
  ref?: BottomSheetModal
}

type LineGroupsProps = LineGroupsBaseProps & (LineGroupsTypeAddProps | LineGroupsTypeSelectProps)

export const LineGroups = ({ trigger, lineCode, type, onGroupPress, sheetProps, ref }: LineGroupsProps) => {
  const sheetRef = useRef<BottomSheetModal>(null)

  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))!
  const groups = useLinesStore(useShallow(state => Object.values(state.lineGroups[selectedCity])))

  const handleSelectGroup = (group: LineGroup) => {
    if (type === 'add') {
      addLineToGroup(group.id, lineCode)
    } else {
      selectGroup(group.id)
    }

    sheetRef.current?.dismiss()
  }

  return (
    <UiSheet
      ref={sheetRef}
      trigger={trigger}
      sheetProps={{
        snapPoints: ['50%', '100%'],
        enableDynamicSizing: false,
        ...sheetProps,
      }}
      list
    >
      {groups.length < 1
        ? (
            <View style={styles.emptyGroupContainer}>
              <UiText dimmed>{i18n.t('emptyGroups')}</UiText>
            </View>
          )
        : (
            <BottomSheetScrollView>
              {groups.map(group => (
                <LineGroupsItem
                  key={group.id}
                  group={group}
                  onPress={() => handleSelectGroup(group)}
                />
              ))}
            </BottomSheetScrollView>
          )}
    </UiSheet>
  )
}

const styles = StyleSheet.create({
  emptyGroupContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
})
