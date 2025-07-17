import { StyleSheet, View } from "react-native";
import Screen from "../../src/components/Screen";
import { Text} from "@rn-vui/themed";
import { global_styles } from "../../src/styles/global";

export default function Pedidos() {
  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Pedidos</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
