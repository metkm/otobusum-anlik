import { useRoutes } from "@/stores/routes";
import { useFilters } from "@/stores/filters";

import { UiText } from "./ui/UiText";
import { UiButton } from "./ui/UiButton";
import { StyleProp, StyleSheet, ViewProps, ViewStyle, View, ScrollView } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useShallow } from "zustand/react/shallow";

interface Props {
  code: string;
}

export function SelectedRoute(props: Props) {
  const rotation = useSharedValue(0);
  const setDirection = useFilters((state) => state.setDirection);
  const deleteRoute = useRoutes((state) => state.deleteRoute);

  const routeColor = useRoutes(useShallow((state) => state.routeColors[props.code]));
  const selectedDirections = useFilters(
    useShallow((state) => state.selectedDirections[props.code])
  );
  const routes = useRoutes(useShallow((state) => state.routes[props.code]));

  const allDirections = [...new Set(routes?.map((it) => it.yon))];

  const currentDirection = selectedDirections ?? allDirections[0];
  const otherDirectionIndex = allDirections.length - allDirections.indexOf(currentDirection) - 1;

  const handleSwiftDirection = () => {
    rotation.value = withTiming(rotation.value + 180, { duration: 500 }, () => {
      runOnJS(setDirection)(props.code, allDirections[otherDirectionIndex])
    });
  };

  const switchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${rotation.value}deg`,
      },
    ],
  }));

  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: routeColor,
    padding: 14,
    borderRadius: 8,
    gap: 8,
    maxWidth: 300,
  };

  return (
    <Animated.View
      layout={LinearTransition}
      exiting={FadeOut}
      entering={FadeIn}
      style={containerStyle}
      key={props.code}
    >
      <View style={styles.titleContainer}>
        <UiText style={{ fontWeight: "bold" }}>{props.code}</UiText>
        <UiButton onPress={() => deleteRoute(props.code)} style={styles.routeButton}>
          <Ionicons name="trash-outline" size={10} color="white" />
        </UiButton>
      </View>

      {allDirections.length > 0 && (
        <View style={styles.routeButtonsContainer}>
          {allDirections.length > 1 && (
            <>
              <Animated.View style={switchAnimatedStyle}>
                <UiButton onPress={handleSwiftDirection}>
                  <Ionicons name="refresh" size={20} color="white" />
                </UiButton>
              </Animated.View>

              <UiButton
                title={allDirections[otherDirectionIndex]}
                style={styles.routeButton}
                size="sm"
              />
            </>
          )}

          <Ionicons name="arrow-forward" size={20} color="rgba(0, 0, 0, 0.5)" />
          <UiButton title={currentDirection} style={styles.routeButton} size="sm" />
        </View>
      )}
    </Animated.View>
  );
}

export function SelectedRoutes({ style, ...rest }: ViewProps) {
  const keys = useRoutes(useShallow((state) => Object.keys(state.routes)));
  const routeKeys = keys || [];

  if (routeKeys.length < 1) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={style} {...rest}>
      <ScrollView contentContainerStyle={styles.codes} horizontal>
        {routeKeys.map((code) => (
          <SelectedRoute key={code} code={code} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  codes: {
    flexDirection: "row",
    gap: 8,
    padding: 14,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  routeButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    overflow: "hidden",
  },
  routeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },
});
