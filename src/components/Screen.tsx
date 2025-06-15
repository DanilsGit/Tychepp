import { ScrollView, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, paddingTop: insets.top, width: "100%", height: "100%" }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </ScrollView>
  );
}
