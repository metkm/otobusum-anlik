import { Theme } from '@material/material-color-utilities'
import Ionicons from '@react-native-vector-icons/ionicons'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LatLng, Marker } from 'react-native-maps'

import { useTheme } from '@/hooks/useTheme'

import { MarkersFiltersInView } from '../../filters/MarkersFiltersInView'
import { MarkersFiltersZoom } from '../../filters/MarkersFiltersZoom'

interface MarkersLineArrowsProps {
  arrows: {
    coordinates: LatLng
    angle: number
  }[]
  lineTheme?: Theme
}

export const MarkersLineArrows = ({ arrows, lineTheme }: MarkersLineArrowsProps) => {
  const { getSchemeColorHex } = useTheme(lineTheme)

  const arrowBackground: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('primary'),
    borderRadius: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 14,
    height: 14,
  }

  return (
    <MarkersFiltersInView
      data={arrows}
      renderItem={item => (
        <MarkersFiltersZoom
          key={`${item.coordinates.latitude}-${item.coordinates.longitude}`}
          limit={13}
        >
          <Marker
            coordinate={item.coordinates}
            tracksViewChanges={false}
            tracksInfoWindowChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={1}
          >
            <View style={arrowBackground}>
              <Ionicons
                name="arrow-up"
                size={10}
                style={{
                  transform: [
                    {
                      rotate: `${item.angle}deg`,
                    },
                  ],
                }}
              />
            </View>
          </Marker>
        </MarkersFiltersZoom>
      )}
    />
  )
}
