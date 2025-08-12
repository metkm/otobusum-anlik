import { StyleSheet, View, ViewProps } from 'react-native'

import { UiSheet } from '@/components/ui/UiSheet'

import { useAnnouncements } from '@/hooks/queries/useAnnouncements'

import { UiButton } from '../../ui/UiButton'
import { UiText } from '../../ui/UiText'

interface LineAnnouncementsProps extends ViewProps {
  lineCode: string
}

export const LineAnnouncements = ({ lineCode }: LineAnnouncementsProps) => {
  const { query } = useAnnouncements()

  const announcements = query.data?.filter(ann => ann.HATKODU === lineCode)

  if (announcements === undefined || announcements.length < 1) {
    return
  }

  return (
    <UiSheet
      trigger={(
        <UiButton
          icon="megaphone-outline"
          variant="soft"
        />
      )}
      sheetProps={{
        snapPoints: ['50%'],
      }}
      list
    >
      {announcements.map((ann, index) => (
        <View key={`${ann.GUNCELLEME_SAATI}-${ann.MESAJ}-${index}`} style={styles.announcementContainer}>
          <UiText>{ann.GUNCELLEME_SAATI}</UiText>
          <UiText>{ann.MESAJ}</UiText>
        </View>
      ))}
    </UiSheet>
  )
}

const styles = StyleSheet.create({
  announcementContainer: {
    padding: 12,
    flex: 1,
  },
})
