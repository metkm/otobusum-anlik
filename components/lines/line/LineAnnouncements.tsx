import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { memo, useRef } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'

import { UiSheetModal } from '../../ui/sheet/UiSheetModal'
import { UiButton } from '../../ui/UiButton'
import { UiText } from '../../ui/UiText'

import { getTheme, useLinesStore } from '@/stores/lines'

interface LineAnnouncementsProps extends ViewProps {
  lineCode: string
}

const LineAnnouncements = ({ lineCode }: LineAnnouncementsProps) => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))
  const { query } = useAnnouncements()

  const announcements = query.data?.filter(ann => ann.HATKODU === lineCode)

  return (
    <>
      <UiButton
        onPress={() => bottomSheetModal.current?.present()}
        disabled={announcements === undefined || announcements.length === 0}
        icon="megaphone-outline"
        theme={lineTheme}
      />

      {announcements !== undefined && announcements.length > 0 && (
        <UiSheetModal
          cRef={bottomSheetModal}
          snapPoints={['50%']}
          enableDynamicSizing={false}
        >
          <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            {announcements.map(ann => (
              <View key={`${ann.GUNCELLEME_SAATI}-${ann.MESAJ}`} style={styles.announcementContainer}>
                <UiText>{ann.GUNCELLEME_SAATI}</UiText>
                <UiText>{ann.MESAJ}</UiText>
              </View>
            ))}
          </BottomSheetScrollView>
        </UiSheetModal>
      )}
    </>
  )
}

export const LineAnnouncementsMemoized = memo(LineAnnouncements)

const styles = StyleSheet.create({
  contentContainer: {
    padding: 8,
  },
  announcementContainer: {
    padding: 8,
    flex: 1,
  },
})
