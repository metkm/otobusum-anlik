import {
  AdvancedMarker,
  useAdvancedMarkerRef,
  type AdvancedMarkerProps,
  type InfoWindowProps,
} from '@vis.gl/react-google-maps'
import React, { useCallback, useState } from 'react'

interface MarkersCalloutProps {
  markerProps: AdvancedMarkerProps
  calloutProps?: InfoWindowProps & { children: React.ReactNode }
  children: React.ReactNode
}

export const MarkersCallout = ({
  markerProps,
  calloutProps,
  children,
}: MarkersCalloutProps) => {
  const [markerRef] = useAdvancedMarkerRef()

  const [infoWindowShown, setInfoWindowShown] = useState(false)

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), [])

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={handleMarkerClick}
        {...markerProps}
      >
        {infoWindowShown
          ? calloutProps?.children
          : children}
      </AdvancedMarker>
    </>
  )
}
