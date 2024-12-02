import * as Location from 'expo-location'
import { Switch } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { SettingContainer } from './Container'

import { colors } from '@/constants/colors'
import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export const SettingsLocation = () => {
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))

  const handleToggleLocation = async () => {
    let showLocation = useSettingsStore.getState().showMyLocation
    if (!showLocation) {
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (granted) {
        showLocation = true
      }
    } else {
      showLocation = false
    }

    useSettingsStore.setState(() => ({
      showMyLocation: showLocation,
    }))
  }

  return (
    <SettingContainer title={i18n.t('showMyLocation')}>
      <Switch
        onValueChange={handleToggleLocation}
        value={showMyLocation}
        thumbColor={colors.primary}
        trackColor={{ true: colors.primaryDarker }}
      />
    </SettingContainer>
  )
}
