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
  lineCode?: string
}

export const MarkersLineArrows = ({ arrows, lineCode }: MarkersLineArrowsProps) => {
  const { schemeColor } = useTheme(lineCode)

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
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={1}
          >
            <Ionicons
              name="arrow-up"
              size={12}
              color={schemeColor.onPrimary}
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
