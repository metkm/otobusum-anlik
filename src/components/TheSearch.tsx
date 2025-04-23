import { Pressable, StyleSheet, View } from "react-native";
import { UiTextInput } from "./ui/UiTextInput";
import { useRouter } from "expo-router";
import { usePaddings } from "@/hooks/usePaddings";
import { i18n } from "@/translations/i18n";
import { TheMapButtons } from "./TheMapButtons";

export const TheSearch = () => {
  const paddings = usePaddings();
  const router = useRouter();

  return (
    <View style={[styles.container, paddings]}>
      <View>
        <Pressable
          onPress={() => {
            router.navigate("/modal");
          }}
        >
          <View pointerEvents="none">
            <UiTextInput icon="search" placeholder={i18n.t("searchPlaceholder")} readOnly />
          </View>
        </Pressable>
      </View>

      <TheMapButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    display: 'flex',
    gap: 8,
  },
});
