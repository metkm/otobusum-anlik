import { GoogleMapsContext, useMapsLibrary } from '@vis.gl/react-google-maps'
import type { Ref, RefObject } from 'react'
import {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onDrag?: (e: google.maps.MapMouseEvent) => void
  onDragStart?: (e: google.maps.MapMouseEvent) => void
  onDragEnd?: (e: google.maps.MapMouseEvent) => void
  onMouseOver?: (e: google.maps.MapMouseEvent) => void
  onMouseOut?: (e: google.maps.MapMouseEvent) => void
}

type PolylineCustomProps = {
  /**
   * this is an encoded string for the path, will be decoded and used as a path
   */
  encodedPath?: string
}

export type PolylineProps = google.maps.PolylineOptions &
  PolylineEventProps &
  PolylineCustomProps

interface PolylinePropsWithRef extends PolylineProps {
  cRef?: RefObject<google.maps.Polyline>
}

export type PolylineRef = Ref<google.maps.Polyline | null>

function usePolyline(props: PolylineProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPath,
    ...polylineOptions
  } = props
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = useRef<Record<string, (e: unknown) => void>>({})
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
  })

  const geometryLibrary = useMapsLibrary('geometry')

  const polyline = useRef(new google.maps.Polyline()).current
  // update PolylineOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  useMemo(() => {
    polyline.setOptions(polylineOptions)
  }, [polyline, polylineOptions])

  const map = useContext(GoogleMapsContext)?.map

  // update the path with the encodedPath
  useMemo(() => {
    if (!encodedPath || !geometryLibrary) return
    const path = geometryLibrary.encoding.decodePath(encodedPath)
    polyline.setPath(path)
  }, [polyline, encodedPath, geometryLibrary])

  // create polyline instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polyline> has to be inside a Map component.')

      return
    }

    polyline.setMap(map)

    return () => {
      polyline.setMap(null)
    }
  }, [map, polyline])

  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!polyline) return

    // Add event listeners
    const gme = google.maps.event;
    [
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut'],
    ].forEach(([eventName, eventCallback]) => {
      if (!eventName) return
      gme.addListener(polyline, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback!]
        if (callback) callback(e)
      })
    })

    return () => {
      gme.clearInstanceListeners(polyline)
    }
  }, [polyline])

  return polyline
}

export const Polyline = ({ cRef, ...props }: PolylinePropsWithRef) => {
  const polyline = usePolyline(props)

  useImperativeHandle(cRef, () => polyline, [polyline])

  return null
}

/**
 * Component to render a polyline on a map
 */
// export const Polyline = forwardRef(Polyline)

export const MarkersLinePolyline = ({ lineCode }: { lineCode: string }) => {
  const { schemeColor } = useTheme(lineCode)

  const { getRouteFromCode } = useRoutes(lineCode)
  const route = getRouteFromCode()

  return (
    <Polyline
      path={route?.route_path || []}
      strokeColor={schemeColor.primary}
      strokeWeight={6}
    />
  )
}
