import * as Location from 'expo-location'
import { useShallow } from 'zustand/react/shallow'

import { SettingsContainer } from './SettingsContainer'

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
    <SettingsContainer
      type="switch"
      title={i18n.t('showMyLocation')}
      value={showMyLocation}
      onChange={handleToggleLocation}
    />
  )
}
