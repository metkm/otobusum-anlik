import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Uniwind } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheet } from '@/components/u/USheet'
import { USwitch } from '@/components/u/USwitch'
import { UText } from '@/components/u/UText'

import { useColorScheme } from '@/composables/useLineTheme'
import { MapStyle, mapStyles } from '@/constants/mapStyles'
import { useSettingsStore } from '@/stores'
import { i18n } from '@/translations/i18n'

const appThemes: {
  label: string
  value: 'dark' | 'light' | undefined
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

export const SettingsScreen = () => {
  const mapStyleSheet = useRef<TrueSheet>(null)
  const appStyleSheet = useRef<TrueSheet>(null)

  const colorScheme = useColorScheme()

  const toggleMyLocation = useSettingsStore(useShallow(state => state.toggleMyLocation))
  const showMyLocation = useSettingsStore(useShallow(state => state.showMyLocation))
  const showTraffic = useSettingsStore(useShallow(state => state.showTraffic))
  const colorSchemeStore = useSettingsStore(useShallow(state => state.colorScheme))

  const { scheme: mapScheme } = useSettingsStore(useShallow(state => state.getMapStyle(colorScheme)))

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
      <UButton
        label={i18n.t('showMyLocation')}
        color="neutral"
        size="lg"
        onPress={toggleMyLocation}
      >
        <USwitch value={showMyLocation} />
      </UButton>

      <UButton
        label={i18n.t('showTraffic')}
        color="neutral"
        size="lg"
        onPress={toggleTraffic}
      >
        <USwitch
          value={showTraffic}
          onValueChange={toggleTraffic}
        />
      </UButton>

      <UButton
        label={i18n.t(mapScheme)}
        color="neutral"
        size="lg"
        block
        onPress={() => mapStyleSheet.current?.present()}
        className="justify-between"
      >
        <UText className="font-inter-medium">{i18n.t('mapTheme')}</UText>
      </UButton>

      <USheet
        ref={mapStyleSheet}
        detents={['auto']}
        contentContainerClassName="px-2 gap-2"
      >
        {Object.keys(mapStyles).map(mapStyle => (
          <UButton
            key={mapStyle}
            label={i18n.t(mapStyle)}
            variant={mapStyle === mapScheme ? 'solid' : 'ghost'}
            color={mapStyle === mapScheme ? 'primary' : 'neutral'}
            block
            onPress={() => {
              useSettingsStore.setState((state) => {
                state.mapStyle = mapStyle as MapStyle
              })

              mapStyleSheet.current?.dismiss()
            }}
          />
        ))}
      </USheet>

      <UButton
        label={!colorSchemeStore ? i18n.t('system') : i18n.t(colorScheme)}
        color="neutral"
        size="lg"
        onPress={() => appStyleSheet.current?.present()}
        className="justify-between"
      >
        <UText>{i18n.t('appTheme')}</UText>
      </UButton>

      <USheet
        ref={appStyleSheet}
        detents={['auto']}
        contentContainerClassName="px-2 gap-2"
      >
        {appThemes.map(sc => (
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
    </ScrollView>

  // <ScrollView
  //   style={{ marginTop: insets.top }}
  //   contentContainerStyle={[styles.scrollContainer]}
  // >
  //   <SettingsGroupContainer title={i18n.t('map')}>
  //     <SettingsLocation />
  //     <SettingsTraffic />

  //     {Platform.OS !== 'web' && (
  //       <SettingsCluster />
  //     )}
  //   </SettingsGroupContainer>

  //   <SettingsGroupContainer title={i18n.t('theme')}>
  //     <SettingsTheme />
  //   </SettingsGroupContainer>

  //   <SettingsGroupContainer title={i18n.t('other')}>
  //     <SettingCity />

  //     <SettingsContainer
  //       type="link"
  //       title={i18n.t('license', { city: 'istanbul' })}
  //       onPress={() => Linking.openURL('https://data.ibb.gov.tr/license')}
  //     />
  //     <SettingsContainer
  //       type="link"
  //       title={i18n.t('license', { city: 'izmir' })}
  //       onPress={() => Linking.openURL('https://acikveri.bizizmir.com/tr/license')}
  //     />
  //   </SettingsGroupContainer>

  //   <UiText style={styles.version}>
  //     {`${i18n.t('version')} ${Constants.expoConfig?.version}`}
  //   </UiText>
  // </ScrollView>
  )
}

// const styles = StyleSheet.create({
//   scrollContainer: {
//     gap: 8,
//     padding: 8,
//   },
//   version: {
//     alignSelf: 'flex-end',
//   },
// })

export default SettingsScreen
