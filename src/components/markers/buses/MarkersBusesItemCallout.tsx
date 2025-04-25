import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'

import { UiText } from '@/components/ui/UiText'

import { useLine } from '@/hooks/queries/useLine'
import { useTheme } from '@/hooks/useTheme'

import { BusLocation } from '@/api/getLineBusLocations'
import { i18n } from '@/translations/i18n'

interface MarkersBusesItemCalloutProps {
  busLocation: BusLocation
  lineCode: string
}

export const MarkersBusesItemCallout = ({ busLocation, lineCode }: MarkersBusesItemCalloutProps) => {
  const { schemeColor } = useTheme(lineCode)
  const { query: { dataUpdatedAt } } = useLine(lineCode)

  const dynamicCalloutContainer: StyleProp<ViewStyle> = {
    backgroundColor: schemeColor.primary,
    padding: 8,
    borderRadius: 4,
    width: 250,
  }

  const textStyle: StyleProp<TextStyle> = {
    color: schemeColor.onPrimary,
    fontWeight: 'bold',
  }

  return (
    <View style={dynamicCalloutContainer}>
      {busLocation.route_code && (
        <UiText style={textStyle}>
          {busLocation.route_code}
        </UiText>
      )}

      <UiText style={textStyle}>
        {i18n.t('doorNo')}
        {': '}
        {busLocation.bus_id}
      </UiText>
      <UiText style={textStyle}>
        {i18n.t('lastUpdate')}
        {': '}
        {new Date(dataUpdatedAt).toLocaleTimeString()}
      </UiText>
    </View>
  )
}
