import { StyleSheet } from "react-native";
import Screen from "../../src/components/Screen";
import { Text } from "@rn-vui/base";
import { global_styles } from "../../src/styles/global";
import { useUrgentOrderStore } from "../../src/features/orders/storages/urgentOrdersStorage";
import UrgentOrdersList from "../../src/features/orders/components/UrgentOrderList";

export default function Atencion() {
  const { status } = useUrgentOrderStore();

  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Atención humana</Text>
      <Text style={global_styles.subTitle}>
        Atiende rápidamente estos pedidos, ya que son pedidos que requieren
        atención humana inmediata.
      </Text>

      <Text style={styles.status}>{status}</Text>

      <UrgentOrdersList />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  status: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});
