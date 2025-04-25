import Ionicons from '@react-native-vector-icons/ionicons'
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps'
import { StyleProp, View, ViewStyle } from 'react-native'
import { LatLng } from 'react-native-maps'

import { useTheme } from '@/hooks/useTheme'

import { MarkersFiltersInView } from '../../filters/MarkersFiltersInView'
import { MarkersFiltersZoom } from '../../filters/MarkersFiltersZoom'

interface MarkersLineArrowsProps {
  arrows: {
    coordinates: LatLng
    angle: number
  }[]
  lineCode?: string
}

export const MarkersLineArrows = ({ arrows, lineCode }: MarkersLineArrowsProps) => {
  const { schemeColor } = useTheme(lineCode)

  const arrowBackground: StyleProp<ViewStyle> = {
    backgroundColor: schemeColor.primary,
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
          <AdvancedMarker
            position={{
              lat: item.coordinates.latitude,
              lng: item.coordinates.longitude,
            }}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
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
          </AdvancedMarker>
        </MarkersFiltersZoom>
      )}
    />
  )
}
