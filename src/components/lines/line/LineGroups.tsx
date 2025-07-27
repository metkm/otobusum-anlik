import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { RefObject, useCallback } from 'react'
import { ViewProps } from 'react-native'
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
  cRef?: RefObject<BottomSheetModal | null>
  lineCodeToAdd?: string
}

export const LineGroups = ({ onPressGroup, lineCodeToAdd, ...props }: LineGroupsProps) => {
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))!
  const groups = useLinesStore(useShallow(state => Object.values(state.lineGroups[selectedCity])))

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

  return (
    <>
      {props.children}

      <UiSheetModal
        cRef={props.cRef}
        snapPoints={['50%']}
        title={i18n.t('lineGroups')}
        icon="albums"
        enableDynamicSizing={false}
        footer={() => (
          <UiButton icon="add" title={i18n.t('createNewGroup')} onPress={handlePressNewGroup} />
        )}
        list
      >
        {groups.map(group => (
          <LineGroupsItem key={group.id} group={group} onPress={() => handlePressGroup(group)} />
        ))}
      </UiSheetModal>
    </>
  )
}
