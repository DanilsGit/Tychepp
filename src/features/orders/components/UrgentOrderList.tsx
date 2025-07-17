import { FlatList, View } from "react-native";
import { Text } from "@rn-vui/themed";
import { useUrgentOrderStore } from "../storages/urgentOrdersStorage";
import UrgentOrderItem from "./UrgentOrderItem";

export default function UrgentOrdersList() {
  const { isLoading, urgentOrders } = useUrgentOrderStore();

  if (isLoading) {
    return null;
  }

  return (
    <FlatList
      data={urgentOrders}
      renderItem={({ item }) => <UrgentOrderItem conversation={item} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={{ textAlign: "center" }}>
          Aún no tienes pedidos urgentes.
        </Text>
      }
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
}
