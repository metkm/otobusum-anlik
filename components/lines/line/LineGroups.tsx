import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { RefObject, useCallback } from 'react'
import {
  StyleSheet,
  View,
  ViewProps,
  ListRenderItem,
} from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'
import { UiButton } from '@/components/ui/UiButton'

import { LineGroupsItem } from './LineGroupsItem'

import { useFiltersStore } from '@/stores/filters'
import { addLineToGroup, createNewGroup, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { LineGroup } from '@/types/lineGroup'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (group: LineGroup) => void
  cRef?: RefObject<BottomSheetModal>
  lineCodeToAdd?: string
}

export const LineGroups = ({ onPressGroup, lineCodeToAdd, ...props }: LineGroupsProps) => {
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))!
  const lineGroups = useLinesStore(useShallow(state => state.lineGroups))
  const groups = Object.values(lineGroups[selectedCity])

  const handlePressNewGroup = useCallback(() => {
    createNewGroup()
  }, [])

  const handlePressGroup = useCallback(
    (group: LineGroup) => {
      onPressGroup?.(group)
      if (!lineCodeToAdd) return

      addLineToGroup(group.id, lineCodeToAdd)
      props.cRef?.current?.dismiss()
    },
    [lineCodeToAdd, props.cRef, onPressGroup],
  )

  const renderItem: ListRenderItem<LineGroup> = useCallback(
    ({ item }) => <LineGroupsItem group={item} onPress={() => handlePressGroup(item)} />,
    [handlePressGroup],
  )

  return (
    <>
      {props.children}

      <UiSheetModal
        cRef={props.cRef}
        snapPoints={['50%']}
        enableDynamicSizing={false}
      >
        <View style={styles.container}>
          <BottomSheetFlatList
            data={groups}
            renderItem={renderItem}
          />

          <View style={styles.buttonContainer}>
            <UiButton
              icon="add"
              title={i18n.t('createNewGroup')}
              onPress={handlePressNewGroup}
            />
          </View>
        </View>
      </UiSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 8,
    paddingTop: 0,
  },
  contentContainer: {
    gap: 4,
    padding: 8,
  },
})
