import Constants from 'expo-constants'
import { Linking, Platform, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SettingCity } from '@/components/settings/SettingsCity'
import { SettingsCluster } from '@/components/settings/SettingsCluster'
import { SettingsGroupContainer, SettingsContainer } from '@/components/settings/SettingsContainer'
import { SettingsLocation } from '@/components/settings/SettingsLocation'
import { SettingsTheme } from '@/components/settings/SettingsTheme'
import { SettingsTraffic } from '@/components/settings/SettingsTraffic'
import { UiText } from '@/components/ui/UiText'

import { i18n } from '@/translations/i18n'

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={{ marginTop: insets.top }}
      contentContainerStyle={[styles.scrollContainer]}
    >
      <SettingsGroupContainer title={i18n.t('map')}>
        <SettingsLocation />
        <SettingsTraffic />

        {Platform.OS !== 'web' && (
          <SettingsCluster />
        )}
      </SettingsGroupContainer>

      <SettingsGroupContainer title={i18n.t('theme')}>
        <SettingsTheme />
      </SettingsGroupContainer>

      <SettingsGroupContainer title={i18n.t('other')}>
        <SettingCity />

        <SettingsContainer
          type="link"
          title={i18n.t('license', { city: 'istanbul' })}
          onPress={() => Linking.openURL('https://data.ibb.gov.tr/license')}
        />
        <SettingsContainer
          type="link"
          title={i18n.t('license', { city: 'izmir' })}
          onPress={() => Linking.openURL('https://acikveri.bizizmir.com/tr/license')}
        />
      </SettingsGroupContainer>

      <UiText style={styles.version}>
        {`${i18n.t('version')} ${Constants.expoConfig?.version}`}
      </UiText>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 8,
    padding: 8,
  },
  version: {
    alignSelf: 'flex-end',
  },
})

export default SettingsScreen
