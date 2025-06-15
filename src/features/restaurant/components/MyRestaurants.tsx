import { FlatList } from "react-native";
import { useGetRestaurants } from "../hools/useGetRestaurants";
import RestaurantItem from "./RestaurantItem";
import { Text } from "@rneui/themed";

export default function MyRestaurant() {
  const { isLoading, restaurants } = useGetRestaurants();

  if (isLoading) {
    return null;
  }

  return (
    <FlatList
      data={restaurants}
      renderItem={({ item }) => <RestaurantItem restaurant={item} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={{ textAlign: "center" }}>
          Aún no has agregado restaurantes
        </Text>
      }
      scrollEnabled={false}
    />
  );
}
