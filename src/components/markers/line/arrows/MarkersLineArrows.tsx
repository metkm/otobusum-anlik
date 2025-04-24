import { type Theme } from '@material/material-color-utilities'
import Ionicons from '@react-native-vector-icons/ionicons'
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

  return (
    <MarkersFiltersInView
      data={arrows}
      renderItem={item => (
        <MarkersFiltersZoom
          key={`${item.coordinates.latitude}-${item.coordinates.longitude}`}
          limit={14}
        >
          <Marker
            coordinate={item.coordinates}
            tracksViewChanges={false}
            tracksInfoWindowChanges={false}
            anchor={{ x: 0.2, y: 0.2 }}
            zIndex={1}
          >
            <Ionicons
              name="arrow-up"
              size={12}
              color={getSchemeColorHex('onPrimary')}
              style={{
                transform: [
                  {
                    rotateZ: `${item.angle}rad`,
                  },
                ],
              }}
            />
          </Marker>
        </MarkersFiltersZoom>
      )}
    />
  )
}
