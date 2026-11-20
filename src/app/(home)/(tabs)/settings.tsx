import type { TrueSheet } from '@lodev09/react-native-true-sheet'
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import Constants from 'expo-constants'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Uniwind, withUniwind } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { queryCache } from '@/api/client'
import { UButton, UIcon, type IconName, USheet, USwitch, UText } from '@/components/u'
import type { MapStyle } from '@/constants/mapStyles'
import { useFilterStore, useSettingsStore } from '@/stores'
import type { City } from '@/types/city'

const StyledMaterialDesignIcons = withUniwind(MaterialDesignIcons, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor',
  },
})

const ToggleSetting = ({
  label,
  value,
  onPress,
}: {
  label: string
  value: boolean
  onPress: () => void
}) => (
  <UButton
    label={label}
    color="neutral"
    variant="ghost"
    size="lg"
    onPress={onPress}
    className="flex-row-reverse justify-between"
  >
    <USwitch value={value} />
  </UButton>
)

interface Option<T> {
  label: string
  value: T
}

export const OptionPicker = <T,>({
  label,
  description,
  options,
  value,
  onSelect,
}: {
  label: string
  description?: string
  options: Option<T>[]
  value: Option<T>
  onSelect: (option: Option<T>) => void
}) => {
  const sheetRef = useRef<TrueSheet>(null)

  const handleSelect = (option: Option<T>) => {
    onSelect(option)
    void sheetRef.current?.dismiss()
  }

  return (
    <>
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        onPress={() => void sheetRef.current?.present()}
      >
        <View className="flex-1 flex-row items-center justify-between gap-2">
          <View className="flex-1">
            <UText className="font-inter-medium text-sm">{label}</UText>

            {description && (
              <UText
                className="font-inter-medium text-muted flex-1 text-sm"
                numberOfLines={1}
              >
                {description}
              </UText>
            )}
          </View>

          <UText className="font-inter-medium text-sm">{value.label}</UText>
        </View>
      </UButton>

      <USheet
        ref={sheetRef}
        contentContainerClassName="px-2 gap-2"
        detents={['auto']}
      >
        {options.map((option) => (
          <UButton
            key={option.label}
            label={option.label}
            onPress={() => handleSelect(option)}
            color={option.value === value.value ? 'primary' : 'neutral'}
            variant="soft"
            size="lg"
            block
          />
        ))}
      </USheet>
    </>
  )
}

const SettingsSectionTitle = ({ icon, title }: { icon: IconName; title: string }) => (
  <View className="flex-row items-center gap-2 p-2 px-2.5">
    <UIcon name={icon} />
    <UText className="font-inter-semibold">{title}</UText>
  </View>
)

export const SettingsScreen = () => {
  const { t } = useTranslation()

  const mapButtonsPlacement = useSettingsStore(useShallow((state) => state.mapButtonsPlacement))
  const cardExpandOnScroll = useSettingsStore(useShallow((state) => state.cardExpandOnScroll))

  const showLineCardStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))

  const toggleMyLocation = useSettingsStore(useShallow((state) => state.toggleMyLocation))
  const showMyLocation = useSettingsStore(useShallow((state) => state.showMyLocation))
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))
  const city = useFilterStore(useShallow((state) => state.city))

  const mapStyleStore = useSettingsStore(useShallow((state) => state.mapStyle))
  const colorSchemeStore = useSettingsStore(useShallow((state) => state.colorScheme))

  const appThemeOptions: {
    label: string
    value: 'dark' | 'light' | undefined
  }[] = [
    {
      label: t('dark'),
      value: 'dark',
    },
    {
      label: t('light'),
      value: 'light',
    },
    {
      label: t('system'),
      value: undefined,
    },
  ]

  const mapThemeOptions: { label: string; value: MapStyle | undefined; preview?: string }[] = [
    {
      label: t('dark'),
      value: 'dark',
    },
    {
      label: t('liberty'),
      value: 'liberty',
    },
    {
      label: t('system'),
      value: undefined,
    },
  ]

  const mapButtonsPlacementOptions: Option<'left' | 'right'>[] = [
    {
      label: t('left'),
      value: 'left',
    },
    {
      label: t('right'),
      value: 'right',
    },
  ]

  const cityOptions: Option<City>[] = [
    {
      label: t('istanbul'),
      value: 'istanbul',
    },
    {
      label: t('izmir'),
      value: 'izmir',
    },
  ]

  const toggleMap = () => {
    useSettingsStore.setState((state) => {
      state.hideMap = !state.hideMap
    })
  }

  const togglecardExpandOnScroll = () => {
    useSettingsStore.setState((state) => {
      state.cardExpandOnScroll = !state.cardExpandOnScroll
    })
  }

  const clearCache = () => {
    queryCache.clear()
  }

  return (
    <ScrollView
      contentContainerClassName="gap-2 pt-safe-offset-2 pb-nav-offset-2"
      showsVerticalScrollIndicator={false}
    >
      <SettingsSectionTitle
        title={t('map')}
        icon="map"
      />

      <ToggleSetting
        label={t('showMyLocation')}
        onPress={toggleMyLocation}
        value={showMyLocation}
      />

      <ToggleSetting
        label={t('hideMap')}
        onPress={toggleMap}
        value={hideMap}
      />

      <OptionPicker
        label={t('mapTheme')}
        options={mapThemeOptions}
        value={{ label: t(mapStyleStore ?? 'system'), value: mapStyleStore }}
        onSelect={({ value }) => {
          useSettingsStore.setState((state) => {
            state.mapStyle = value
          })
        }}
      />

      <OptionPicker
        label={t('mapButtonsPlacements')}
        description={t('mapButtonsPlacementsDescription')}
        options={mapButtonsPlacementOptions}
        value={{ label: t(mapButtonsPlacement), value: mapButtonsPlacement }}
        onSelect={({ value }) => {
          useSettingsStore.setState((state) => {
            state.mapButtonsPlacement = value
          })
        }}
      />

      <View className="h-hairline bg-muted" />

      <SettingsSectionTitle
        title={t('settings')}
        icon="settings"
      />

      <ToggleSetting
        label={t('cardExpandOnScroll')}
        value={cardExpandOnScroll}
        onPress={togglecardExpandOnScroll}
      />

      <ToggleSetting
        label={t('showLineCardStops')}
        value={showLineCardStops}
        onPress={() => {
          useSettingsStore.setState((state) => {
            state.lineCardShowStops = !state.lineCardShowStops
          })
        }}
      />

      <OptionPicker
        label={t('appTheme')}
        options={appThemeOptions}
        value={{ label: t(colorSchemeStore ?? 'system'), value: colorSchemeStore }}
        onSelect={({ value }) => {
          useSettingsStore.setState((state) => {
            state.colorScheme = value
            Uniwind.setTheme(value ?? 'system')
          })
        }}
      />

      <OptionPicker
        label={t('city')}
        options={cityOptions}
        value={{ label: t(city), value: city }}
        onSelect={({ value }) => {
          useFilterStore.setState((state) => {
            state.city = value
          })
        }}
      />

      <View className="h-hairline bg-muted" />

      <SettingsSectionTitle
        title={t('other')}
        icon="settings-2"
      />

      <UButton
        label={t('clearCache')}
        onPress={clearCache}
        variant="ghost"
        color="neutral"
        size="lg"
      />

      <UButton
        label={t('license', { city: 'istanbul' })}
        onPress={() => Linking.openURL('https://data.ibb.gov.tr/license')}
        variant="ghost"
        color="neutral"
        size="lg"
      />

      <UButton
        label={t('license', { city: 'izmir' })}
        onPress={() => Linking.openURL('https://acikveri.bizizmir.com/tr/license')}
        variant="ghost"
        color="neutral"
        size="lg"
      />

      <UButton
        variant="soft"
        color="neutral"
        className="mr-auto ml-2"
        onPress={() => Linking.openURL('https://github.com/metkm/otobusum-anlik')}
      >
        <StyledMaterialDesignIcons
          name="github"
          size={24}
          colorClassName="accent-default"
        />
      </UButton>

      <UText className="text-muted font-inter-medium ml-2 text-sm">
        {`${t('version')} ${Constants.expoConfig?.version}`}
      </UText>
    </ScrollView>
  )
}

export default SettingsScreen
