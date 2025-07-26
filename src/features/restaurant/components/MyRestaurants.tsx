import { FlatList, View } from "react-native";
import { useGetRestaurants } from "../hools/useGetRestaurants";
import RestaurantItem from "./RestaurantItem";
import { Text } from "@rn-vui/base";

export default function MyRestaurant() {
  const { isLoading, restaurants } = useGetRestaurants();

  if (isLoading) {
    return null;
  }

  return (
    <FlatList
      data={restaurants}
      renderItem={({ item }) => <RestaurantItem restaurant={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={{ textAlign: "center" }}>
          Aún no has agregado restaurantes
        </Text>
      }
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
}
