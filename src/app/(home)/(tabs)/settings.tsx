import { TrueSheet } from '@lodev09/react-native-true-sheet'
import Constants from 'expo-constants'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Uniwind } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheet } from '@/components/u/USheet'
import { USwitch } from '@/components/u/USwitch'
import { UText } from '@/components/u/UText'

import { MapStyle, MapStyleValue, mapStyles } from '@/constants/mapStyles'
import { useFilterStore, useSettingsStore } from '@/stores'
import { City } from '@/types/city'

export const SettingsScreen = () => {
  const { t } = useTranslation()

  const mapStyleSheet = useRef<TrueSheet>(null)
  const appStyleSheet = useRef<TrueSheet>(null)
  const citySheet = useRef<TrueSheet>(null)

  const toggleMyLocation = useSettingsStore(useShallow(state => state.toggleMyLocation))
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const city = useFilterStore(useShallow(state => state.city))

  const mapStyleStore = useSettingsStore(useShallow(state => state.mapStyle))
  const colorSchemeStore = useSettingsStore(useShallow(state => state.colorScheme))

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

  const mapThemeOptions: { label: string, key: MapStyle | undefined, value: MapStyleValue | undefined }[] = [
    {
      label: t('dark'),
      key: 'dark',
      value: mapStyles['dark'],
    },
    {
      label: t('night'),
      key: 'night',
      value: mapStyles['dark'],
    },
    {
      label: t('light'),
      key: 'light',
      value: mapStyles['light'],
    },
    {
      label: t('retro'),
      key: 'retro',
      value: mapStyles['retro'],
    },
    {
      label: t('system'),
      key: undefined,
      value: undefined,
    },
  ]

  const toggleTraffic = () => {
    useSettingsStore.setState((state) => {
      state.showTraffic = !state.showTraffic
    })
  }

  return (
    <ScrollView
      className="m-safe"
      contentContainerClassName="p-2 gap-2"
    >
      <UText className="text-lg font-inter-medium ml-2">{t('map')}</UText>

      <UButton
        label={t('showMyLocation')}
        color="neutral"
        variant="soft"
        size="lg"
        onPress={toggleMyLocation}
      >
        <USwitch value={showMyLocation} />
      </UButton>

      <UButton
        label={t('showTraffic')}
        color="neutral"
        size="lg"
        variant="soft"
        onPress={toggleTraffic}
      >
        <USwitch
          value={showTraffic}
          onValueChange={toggleTraffic}
        />
      </UButton>

      <UButton
        label={t(mapStyleStore ?? 'system')}
        color="neutral"
        size="lg"
        block
        variant="soft"
        onPress={() => mapStyleSheet.current?.present()}
        className="justify-between"
      >
        <UText className="font-inter-medium">{t('mapTheme')}</UText>
      </UButton>

      <USheet
        ref={mapStyleSheet}
        detents={['auto']}
        contentContainerClassName="px-2 gap-2"
      >
        {mapThemeOptions.map(option => (
          <UButton
            key={option.label}
            label={option.label}
            variant={option.key === mapStyleStore ? 'solid' : 'ghost'}
            color={option.key === mapStyleStore ? 'primary' : 'neutral'}
            block
            onPress={() => {
              useSettingsStore.setState((state) => {
                state.mapStyle = option.key
              })

              mapStyleSheet.current?.dismiss()
            }}
          />
        ))}
      </USheet>

      <UButton
        label={t(colorSchemeStore ?? 'system')}
        color="neutral"
        variant="soft"
        size="lg"
        onPress={() => appStyleSheet.current?.present()}
        className="justify-between"
      >
        <UText>{t('appTheme')}</UText>
      </UButton>

      <USheet
        ref={appStyleSheet}
        detents={['auto']}
        contentContainerClassName="px-2 gap-2"
      >
        {appThemeOptions.map(sc => (
          <UButton
            key={sc.label}
            label={sc.label}
            color={colorSchemeStore === sc.value ? 'primary' : 'neutral'}
            variant={colorSchemeStore === sc.value ? 'solid' : 'ghost'}
            onPress={() => {
              useSettingsStore.setState((state) => {
                state.colorScheme = sc.value
                Uniwind.setTheme(sc.value ?? 'system')
              })

              appStyleSheet.current?.dismiss()
            }}
            block
          />
        ))}
      </USheet>

      <UButton
        label={city}
        variant="soft"
        color="neutral"
        size="lg"
        className="justify-between"
        onPress={() => citySheet.current?.present()}
      >
        <UText>{t('city')}</UText>
      </UButton>

      <USheet
        ref={citySheet}
        detents={['auto']}
        contentContainerClassName="px-2 gap-2"
      >
        {(['izmir', 'istanbul'] as City[]).map(c => (
          <UButton
            key={c}
            label={c}
            variant={c === city ? 'solid' : 'ghost'}
            color={c === city ? 'primary' : 'neutral'}
            onPress={() => {
              useFilterStore.setState((state) => {
                state.city = c
              })
            }}
            block
          />
        ))}
      </USheet>

      <UText className="text-lg font-inter-medium ml-2">{t('other')}</UText>

      <UButton
        label={t('license', { city: 'istanbul' })}
        onPress={() => Linking.openURL('https://data.ibb.gov.tr/license')}
        variant="soft"
        color="neutral"
        size="lg"
      />

      <UButton
        label={t('license', { city: 'izmir' })}
        onPress={() => Linking.openURL('https://acikveri.bizizmir.com/tr/license')}
        variant="soft"
        color="neutral"
        size="lg"
      />

      <UText className="text-muted font-inter-medium ml-auto mr-2 text-xs">
        {`${t('version')} ${Constants.expoConfig?.version}`}
      </UText>
    </ScrollView>
  )
}

export default SettingsScreen
