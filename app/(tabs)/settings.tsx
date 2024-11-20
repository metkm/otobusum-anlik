import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { usePaddings } from '@/hooks/usePaddings'
import { useSettings } from '@/stores/settings'

import { StyleProp, StyleSheet, Switch, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import * as Location from 'expo-location'
import { i18n } from '@/translations/i18n'

export default function Settings() {
  const paddings = usePaddings()
  const showMyLocation = useSettings(useShallow(state => state.showMyLocation))
  const { colorsTheme } = useTheme()

  const dynamicPermissionContainer: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  const handleToggleLocation = async () => {
    let showLocation = useSettings.getState().showMyLocation
    if (!showLocation) {
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (granted) {
        showLocation = true
      }
    } else {
      showLocation = false
    }

    useSettings.setState(() => ({
      showMyLocation: showLocation,
    }))
  }

  return (
    <View style={paddings}>
      <View style={[styles.permissionContainer, dynamicPermissionContainer]}>
        <UiText>{i18n.t('showMyLocation')}</UiText>
        <Switch
          onValueChange={handleToggleLocation}
          value={showMyLocation}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
})