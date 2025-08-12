import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ReactNode, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiButton } from '@/components/ui/UiButton'
import { UiSheet, UiSheetProps } from '@/components/ui/UiSheet'
import { UiText } from '@/components/ui/UiText'

import { LineGroupsItem } from './LineGroupsItem'

import { selectGroup, useFiltersStore } from '@/stores/filters'
import { addLineToGroup, createNewGroup, useLinesStore } from '@/stores/lines'
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

  const snapPoints = groups.length < 1
    ? ['50%']
    : ['50%', '100%']

  return (
    <UiSheet
      ref={sheetRef}
      trigger={trigger}
      sheetProps={{
        snapPoints: snapPoints,
        enableDynamicSizing: false,
        ...sheetProps,
      }}
      innerContainerStyle={groups.length < 1
        ? {
            flexGrow: 1,
          }
        : undefined}
      list
    >
      {groups.length < 1
        ? (
            <View style={styles.emptyGroupContainer}>
              <UiText dimmed>{i18n.t('emptyGroups')}</UiText>

              <UiButton
                icon="add"
                title={i18n.t('createNewGroup')}
                onPress={createNewGroup}
              />
            </View>
          )
        : (
            <BottomSheetScrollView>
              <UiButton
                icon="add"
                title={i18n.t('createNewGroup')}
                onPress={createNewGroup}
              />

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
    gap: 14,
  },
})
