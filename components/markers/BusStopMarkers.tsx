import { getRouteBusStopLocations } from "@/api/getRouteBusStopLocations";
import { useTheme } from "@/hooks/useTheme";
import { useFilters } from "@/stores/filters";
import { useRoutes } from "@/stores/routes";
import { getDirectionFromBusStopLocations } from "@/utils/getDirectionFromBusLocations";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Marker } from "react-native-maps";
import { useShallow } from "zustand/react/shallow";

interface Props {
  code: string;
}

// Rerenders when routes are updated, should be optimized later.
export const BusStopMarkersItem = memo(function BusStopMarkersItem(props: Props) {
  const routeColor = useRoutes(useShallow((state) => state.routeColors[props.code]));
  const selectedDirection = useFilters(useShallow((state) => state.selectedDirections[props.code]));
  const theme = useTheme();

  const query = useQuery({
    queryKey: [`${props.code}-stop-locations`],
    queryFn: () => getRouteBusStopLocations(props.code),
    staleTime: 60_000 * 5, // 5 Minutes
  });

  const busStopStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.color,
    borderColor: theme.surfaceContainer,
  };
  
  if (!query.data) {
    return null;
  }

  const dir = getDirectionFromBusStopLocations(props.code, selectedDirection, query.data)
  const filteredBusStops =dir ? query.data.filter((item) => item.yon === dir) : query.data;

  return (
    <>
      {filteredBusStops.map((bus) => (
        <Marker
          key={`${bus.xKoordinati}-${bus.yKoordinati}-${bus.yon}`}
          coordinate={{
            latitude: parseFloat(bus.yKoordinati),
            longitude: parseFloat(bus.xKoordinati),
          }}
          pinColor={routeColor}
          tracksViewChanges={false}
          tracksInfoWindowChanges={false}
        >
          <View
            style={[styles.busStop, busStopStyle, { backgroundColor: routeColor }]}
          />
        </Marker>
      ))}
    </>
  );
})

export function BusStopMarkers() {
  const routeKeys = useRoutes(useShallow(state => Object.keys(state.routes)))

  return (
    <>
      {routeKeys.map((code) => (
        <BusStopMarkersItem key={code} code={code} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  busStop: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 1000,
  },
});
