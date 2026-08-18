import { TrueSheet } from '@lodev09/react-native-true-sheet'
import Constants from 'expo-constants'
import { Image } from 'expo-image'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Uniwind, withUniwind } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheet } from '@/components/u/USheet'
import { USwitch } from '@/components/u/USwitch'
import { UText } from '@/components/u/UText'

import { queryClient } from '@/api/client'
import { MapStyle, MapStyleValue, mapStyles } from '@/constants/mapStyles'
import { useFilterStore, useSettingsStore } from '@/stores'
import { City } from '@/types/city'

const StyledImage = withUniwind(Image)

export const SettingsScreen = () => {
  const { t } = useTranslation()

  const mapStyleSheet = useRef<TrueSheet>(null)
  const appStyleSheet = useRef<TrueSheet>(null)
  const citySheet = useRef<TrueSheet>(null)

  const expandStopsWhenScrolled = useSettingsStore(useShallow(state => state.expandStopsWhenScrolled))
  const toggleMyLocation = useSettingsStore(useShallow(state => state.toggleMyLocation))
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  // const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const hideMap = useSettingsStore(useShallow(state => state.hideMap))
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

  const mapThemeOptions: { label: string, key: MapStyle | undefined, value: MapStyleValue | undefined, preview?: string }[] = [
    {
      label: t('dark'),
      key: 'dark',
      value: mapStyles['dark'],
      preview: require('@/assets/maps/dark.png'),
    },
    {
      label: t('liberty'),
      key: 'liberty',
      value: mapStyles['liberty'],
      preview: require('@/assets/maps/liberty.png'),
    },
    {
      label: t('system'),
      key: undefined,
      value: undefined,
    },
  ]

  const toggleMap = () => {
    useSettingsStore.setState((state) => {
      state.hideMap = !state.hideMap
    })
  }

  const toggleExpandStopsWhenScrolled = () => {
    useSettingsStore.setState((state) => {
      state.expandStopsWhenScrolled = !state.expandStopsWhenScrolled
    })
  }

  const clearCache = () => {
    queryClient.removeQueries()
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
        label={t('hideMap')}
        color="neutral"
        variant="soft"
        size="lg"
        onPress={toggleMap}
      >
        <USwitch value={hideMap} />
      </UButton>

      {/* <UButton
        label={t('showTraffic')}
        color="neutral"
        size="lg"
        variant="soft"
        onPress={toggleTraffic}
      >
        <USwitch value={showTraffic} />
      </UButton> */}

      <UButton
        label={t(mapStyleStore ?? 'system')}
        color="neutral"
        size="lg"
        block
        variant="soft"
        onPress={() => mapStyleSheet.current?.present()}
        className="justify-between"
      >
        <UText className="font-inter-medium text-xs">{t('mapTheme')}</UText>
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
            labelClassName="min-w-14"
          >
            <View className="mr-2">
              {option.preview && (
                <StyledImage
                  source={option.preview}
                  className="rounded-md h-16 w-28"
                />
              )}
            </View>
          </UButton>
        ))}
      </USheet>

      <UText className="text-lg font-inter-medium ml-2">{t('settings')}</UText>

      <UButton
        label={t('expandStopsWhenScrolled')}
        color="neutral"
        variant="soft"
        size="lg"
        onPress={toggleExpandStopsWhenScrolled}
      >
        <USwitch value={expandStopsWhenScrolled} />
      </UButton>

      <UButton
        label={t(colorSchemeStore ?? 'system')}
        color="neutral"
        variant="soft"
        size="lg"
        onPress={() => appStyleSheet.current?.present()}
        className="justify-between"
      >
        <UText className="font-inter-medium text-xs">{t('appTheme')}</UText>
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
        <UText className="font-inter-medium text-xs">{t('city')}</UText>
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
        label={t('clearCache')}
        onPress={clearCache}
        variant="soft"
        color="neutral"
        size="lg"
      />

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

      <UButton
        variant="soft"
        color="neutral"
        className="ml-auto"
        onPress={() => Linking.openURL('https://github.com/metkm/otobusum-anlik')}
      >
        <StyledImage
          source={require('@/assets/icons/github.svg')}
          className="size-12"
          tintColorClassName="accent-(--ui-text)"
        />
      </UButton>

      <UText className="text-muted font-inter-medium ml-auto mr-2 text-xs">
        {`${t('version')} ${Constants.expoConfig?.version}`}
      </UText>
    </ScrollView>
  )
}

export default SettingsScreen
