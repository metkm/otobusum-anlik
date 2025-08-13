import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { ReactNode, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { Gesture } from 'react-native-gesture-handler'
import { useShallow } from 'zustand/react/shallow'

import { UiButton } from '@/components/ui/UiButton'
import { UiSheet, UiSheetProps } from '@/components/ui/UiSheet'
import { UiText } from '@/components/ui/UiText'

import { LineGroupsItem } from './LineGroupsItem'

import { selectGroup, useFiltersStore } from '@/stores/filters'
import { addLineToGroup, createNewGroup, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsTypeAddProps<T> extends LineGroupsBaseProps<T> {
  type: 'add'
  lineCode: string
}

interface LineGroupsTypeSelectProps<T> extends LineGroupsBaseProps<T> {
  type: 'select'
  lineCode?: string
}

interface LineGroupsBaseProps<T> {
  trigger?: ReactNode
  onGroupPress?: (group: LineGroup) => void
  sheetProps?: Omit<UiSheetProps<T>, 'children'>
  ref?: BottomSheetModal
}

type LineGroupsProps<T> = LineGroupsTypeAddProps<T> | LineGroupsTypeSelectProps<T>

export const LineGroups = <T,>({ trigger, lineCode, type, sheetProps }: LineGroupsProps<T>) => {
  const sheetRef = useRef<BottomSheetModal>(null)

  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))!
  const groups = useLinesStore(useShallow(state => Object.values(state.lineGroups[selectedCity])))

  const tap = Gesture.Tap()

  tap
    .runOnJS(true)
    .onBegin(createNewGroup)

  const handleSelectGroup = (group: LineGroup) => {
    if (type === 'add') {
      addLineToGroup(group.id, lineCode)
    } else {
      selectGroup(group.id)
    }

    sheetRef.current?.dismiss()
  }

  const isList = groups.length > 0
  const snapPoints = !isList
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
      innerContainerStyle={!isList && { flexGrow: 1 }}
      flatlistProps={isList
        ? {
            data: groups,
            renderItem: ({ item }) => {
              return (
                <LineGroupsItem
                  group={item}
                  onPress={() => handleSelectGroup(item)}
                />
              )
            },
            ListHeaderComponent: () => (
              <View style={{ padding: 8 }}>
                <UiButton
                  icon="add"
                  title={i18n.t('createNewGroup')}
                  onPress={createNewGroup}
                />
              </View>
            ),
          }
        : undefined}
    >
      {!isList && (
        <View style={styles.emptyGroupContainer}>
          <UiText dimmed>{i18n.t('emptyGroups')}</UiText>

          <UiButton
            icon="add"
            title={i18n.t('createNewGroup')}
            onPress={createNewGroup}
          />
        </View>
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
