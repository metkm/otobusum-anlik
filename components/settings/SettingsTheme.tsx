import { ColorSchemeName } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { SettingsContainer } from './SettingsContainer'

import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

const options: {
  label: string
  value: ColorSchemeName
}[] = [
  {
    label: i18n.t('dark'),
    value: 'dark',
  },
  {
    label: i18n.t('light'),
    value: 'light',
  },
  {
    label: i18n.t('system'),
    value: undefined,
  },
]

export const SettingsTheme = () => {
  const colorScheme = useSettingsStore(useShallow(state => state.colorScheme))

  const handleValueChange = (newScheme: ColorSchemeName) => {
    useSettingsStore.setState(() => ({
      colorScheme: newScheme,
    }))
  }

  return (
    <SettingsContainer
      title={i18n.t('changeTheme')}
      options={options}
      type="select"
      value={colorScheme}
      onChange={handleValueChange}
    />
  )
}
