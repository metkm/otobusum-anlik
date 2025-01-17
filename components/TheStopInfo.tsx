import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { MapState, Camera } from '@rnmapbox/maps'
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { RefObject, useEffect, useRef } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineGroups } from './lines/line/LineGroups'
import { TheMap, TheMapRef } from './map/Map'
import { MarkersStopItem } from './markers/stop/MarkersStopItem'
import { UiSheetModal } from './ui/sheet/UiSheetModal'
import { UiActivityIndicator } from './ui/UiActivityIndicator'
import { UiButton } from './ui/UiButton'
import { UiText } from './ui/UiText'

import { getStop } from '@/api/getStop'
import { addLine, getTheme, useLinesStore } from '@/stores/lines'
import { useSettingsStore } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

interface TheStopInfoProps {
  cRef: RefObject<TheMapRef>
}

const StopLine = ({ lineCode }: { lineCode: string }) => {
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))

  const handlePress = (lineCode: string) => {
    addLine(lineCode)
  }

  const handleLongPress = () => {
    bottomSheetModal.current?.present()
  }

  return (
    <LineGroups cRef={bottomSheetModal} lineCodeToAdd={lineCode}>
      <UiButton
        key={lineCode}
        title={lineCode}
        variant="soft"
        theme={lineTheme}
        onPress={() => handlePress(lineCode)}
        onLongPress={() => handleLongPress()}
      />
    </LineGroups>
  )
}

export const TheStopInfo = ({ cRef }: TheStopInfoProps) => {
  const { stopId } = useLocalSearchParams<{ stopId?: string }>()
  const bottomSheetModal = useRef<BottomSheetModal>(null)
  const savedMapState = useRef<MapState>()

  const query = useQuery({
    queryKey: ['stop', stopId],
    queryFn: () => getStop(stopId!),
    staleTime: 60_000 * 30,
    enabled: !!stopId,
  })

  useEffect(() => {
    savedMapState.current = useSettingsStore.getState().mapState
    bottomSheetModal.current?.present()
    if (!query.data) return

    if (!query.data) return

    cRef.current?.setCamera({
      centerCoordinate: [query.data.stop.x_coord, query.data.stop.y_coord],
      zoomLevel: 16,
      animationDuration: 500,
      animationMode: 'easeTo',
    })
  }, [query.data, stopId, cRef])

  if (!stopId) return null

  if (query.isPending) {
    return (
      <UiSheetModal cRef={bottomSheetModal} enableDynamicSizing>
        <UiActivityIndicator />
      </UiSheetModal>
    )
  }

  if (bottomSheetModal.current && stopId) {
    bottomSheetModal.current.present()
  }

  const openStopDirections = async () => {
    if (!query.data?.stop) return

    const scheme = `geo:0,0?q=${query.data.stop.y_coord},${query.data.stop.x_coord}&label=${query.data.stop.stop_name}`
    try {
      await Linking.openURL(scheme)
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnDismiss = () => {
    if (!savedMapState.current || !cRef.current) return

    cRef.current.setCamera({
      centerCoordinate: savedMapState.current.properties.center,
      zoomLevel: savedMapState.current.properties.zoom,
      animationDuration: 500,
    })
  }

  return (
    <UiSheetModal
      cRef={bottomSheetModal}
      enableDynamicSizing={true}
      onDismiss={handleOnDismiss}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.mapContainer}>
          {query.data && (
            <TheMap
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
            >
              <Camera
                defaultSettings={{
                  centerCoordinate: [query.data?.stop.x_coord, query.data?.stop.y_coord],
                  zoomLevel: 16,
                }}
              />

              {/* <LineBusStopMarkersItem type="point" stop={query.data.stop} /> */}
            </TheMap>
          )}
        </View>

        <UiButton
          title={i18n.t('stopDirections')}
          onPress={openStopDirections}
          variant="solid"
          icon="location-outline"
        />

        {query.data && (
          <View style={styles.content}>
            <View>
              <UiText>{query.data.stop.stop_code}</UiText>
              <UiText size="lg" style={styles.title}>
                {query.data.stop.stop_name}
              </UiText>
              <UiText>{query.data.stop.province}</UiText>
            </View>

            <View style={styles.linesContainer}>
              <UiText info>{i18n.t('linesThatUseStop')}</UiText>

              <View style={styles.codeOuter}>
                {query.data?.buses.map(lineCode => (
                  <StopLine key={lineCode} lineCode={lineCode} />
                ))}
              </View>
            </View>
          </View>
        )}
      </BottomSheetView>
    </UiSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  map: {
    flex: 1,
    borderRadius: 14,
  },
  mapContainer: {
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    padding: 4,
    gap: 8,
  },
  linesContainer: {
    gap: 4,
  },
  codeOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  code: {
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
})
