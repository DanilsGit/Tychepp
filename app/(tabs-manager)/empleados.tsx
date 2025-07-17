import { global_styles } from "../../src/styles/global";
import { Text } from "@rn-vui/themed";
import { StyleSheet, View } from "react-native";
import { useGetRestaurants } from "../../src/features/restaurant/hools/useGetRestaurants";
import Screen from "../../src/components/Screen";
import EmployeeList from "../../src/features/employeers/components/EmployeeList";

export default function Empleados() {
  const { isLoading, restaurants } = useGetRestaurants();

  if (isLoading) {
    return null;
  }

  const restaurantsReady = restaurants.filter(
    (r) => r.ready && r.restaurant_code
  );

  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Empleados</Text>
      <Text>
        Para invitar a un empleado comparte el código del restaurante donde este
        trabajará.
      </Text>
      {restaurantsReady.map((restaurant) => (
        <View
          key={restaurant.id}
          style={[global_styles.card, styles.verticallySpaced]}
        >
          <Text style={global_styles.title}>{restaurant.name}</Text>
          <Text style={global_styles.subTitle}>
            {restaurant.restaurant_code}
          </Text>
        </View>
      ))}
      {restaurantsReady.length === 0 && (
        <Text style={[global_styles.card, styles.verticallySpaced]}>
          No tienes restaurantes o no están completados.
        </Text>
      )}
      {restaurantsReady.map((restaurant) => (
        <View key={restaurant.id}>
          <Text style={global_styles.title}>
            Empleados de {restaurant.name}
          </Text>
          <EmployeeList restaurantId={restaurant.id} />
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
  verticallySpaced: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
