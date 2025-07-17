import { StyleSheet, Text } from "react-native";
import { global_styles } from "../../src/styles/global";
import { router } from "expo-router";
import { Button } from "@rn-vui/themed";
import Screen from "../../src/components/Screen";
import MenuList from "../../src/features/menu/components/MenuList";

export default function Configuraciones() {
  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Configuraciones</Text>

      <Text style={global_styles.subTitle}>Menús</Text>
      <Button onPress={() => router.push("/createMenu")}>Agregar menú</Button>
      <MenuList />
      <Text style={global_styles.subTitle}>Horarios</Text>
      <Button onPress={() => router.push("/createRestaurant")}>
        Agregar horario
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
});
