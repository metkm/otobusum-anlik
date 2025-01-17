import { useShallow } from 'zustand/react/shallow'

import { SettingsContainer } from './SettingsContainer'

import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export const SettingsTraffic = () => {
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))

  const handleTrafficInformation = () => {
    useSettingsStore.setState(state => ({
      showTraffic: !state.showTraffic,
    }))
  }

  return (
    <SettingsContainer
      type="switch"
      title={i18n.t('showTraffic')}
      onChange={handleTrafficInformation}
      value={showTraffic}
    />
  )
}
