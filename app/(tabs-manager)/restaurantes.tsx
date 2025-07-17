import { Button } from "@rn-vui/themed";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { global_styles } from "../../src/styles/global";
import MyRestaurant from "../../src/features/restaurant/components/MyRestaurants";
import Screen from "../../src/components/Screen";

export default function Restaurantes() {
  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Restaurantes</Text>
      <Button onPress={() => router.push("/createRestaurant")}>
        Agregar nuevo restaurante
      </Button>
      <Text style={global_styles.subTitle}>Tus restaurantes</Text>
      <MyRestaurant />
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
});
