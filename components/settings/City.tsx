import { SettingContainer } from './Container'

import { useFiltersStore } from '@/stores/filters'
import { i18n } from '@/translations/i18n'
import { Cities } from '@/types/cities'

const options: {
  label: string
  value: Cities
}[] = [
  {
    label: 'Istanbul',
    value: 'istanbul',
  },
  {
    label: 'Izmir',
    value: 'izmir',
  },
]

export const SettingCity = () => {
  const selectedCity = useFiltersStore(state => state.selectedCity)

  const handleValueChange = (newCity: Cities) => {
    useFiltersStore.setState(() => ({
      selectedCity: newCity,
    }))
  }

  return (
    <SettingContainer
      title={i18n.t('city')}
      type="select"
      options={options}
      value={selectedCity}
      onChange={handleValueChange}
    />
  )
}
