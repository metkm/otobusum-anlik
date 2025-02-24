import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'

import { UiSheetModal } from '../../ui/sheet/UiSheetModal'
import { UiButton } from '../../ui/UiButton'
import { UiText } from '../../ui/UiText'

interface LineAnnouncementsProps extends ViewProps {
  lineCode: string
}

export const LineAnnouncements = ({ lineCode }: LineAnnouncementsProps) => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const { query } = useAnnouncements()

  const announcements = query.data?.filter(ann => ann.HATKODU === lineCode)

  return (
    <>
      <UiButton
        onPress={() => bottomSheetModal.current?.present()}
        disabled={announcements === undefined || announcements.length === 0}
        icon="megaphone-outline"
        variant="soft"
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

const styles = StyleSheet.create({
  contentContainer: {
    padding: 8,
  },
  announcementContainer: {
    padding: 8,
    flex: 1,
  },
})
