import { StyleSheet, Text } from "react-native";
import Screen from "../../src/components/Screen";
import { global_styles } from "../../src/styles/global";
import { useLocalSearchParams } from "expo-router";

export default function addProduct() {
  const { id } = useLocalSearchParams();

  console.log("ID del menú:", id);

  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Productos del menú</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "space-between",
  },
});
