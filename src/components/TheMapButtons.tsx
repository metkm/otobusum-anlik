import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { usePaddings } from '@/hooks/usePaddings'

import { LineGroups } from './lines/line/LineGroups'
import { UiButton } from './ui/UiButton'

import { changeRouteDirection, selectGroup, unSelectGroup, useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { LineGroup } from '@/types/lineGroup'

export const TheMapButtons = () => {
  const { tabRoutePaddings } = usePaddings()
  const sheetGroups = useRef<BottomSheetModal>(null)
  const router = useRouter()

  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))
  const selectedGroup = useFiltersStore(state => state.selectedGroup)

  const lineGroups = useLinesStore(
    useShallow(state => Object.keys(state.lineGroups[selectedCity])),
  )
  const lines = useLinesStore(useShallow(() => getLines()))

  const changeRouteDirections = () => {
    for (let index = 0; index < lines.length; index++) {
      const lineCode = lines[index]
      if (!lineCode) continue

      changeRouteDirection(lineCode)
    }
  }

  const openGroupSelection = () => {
    sheetGroups.current?.present()
  }

  const selectLineGroup = (group: LineGroup) => {
    selectGroup(group.id)
    sheetGroups.current?.dismiss()
  }

  return (
    <View style={[styles.container, tabRoutePaddings]}>
      <UiButton
        onPress={() => router.navigate('/modal')}
        icon="search"
        variant="soft"
        square
        containerStyle={styles.buttonContainer}
      />

      {lines.length > 0 && (
        <UiButton
          icon="repeat"
          onPress={changeRouteDirections}
          variant="soft"
          square
          containerStyle={styles.buttonContainer}
        />
      )}

      {lineGroups.length > 0 && (
        <>
          <UiButton
            icon="albums"
            onPress={openGroupSelection}
            variant="soft"
            square
            containerStyle={styles.buttonContainer}
          />

          <LineGroups
            cRef={sheetGroups}
            onPressGroup={selectLineGroup}
          />

          {selectedGroup && (
            <UiButton
              icon="close"
              onPress={unSelectGroup}
              variant="soft"
              square
              containerStyle={styles.buttonContainer}
            />
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    gap: 4,
    pointerEvents: 'auto',
  },
  buttonContainer: {
    elevation: 2,
  },
})
