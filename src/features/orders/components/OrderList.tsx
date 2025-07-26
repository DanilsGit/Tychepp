import { FlatList, View } from "react-native";
import { Text } from "@rn-vui/base";
import { Order } from "../../../types/rowTypes";
import OrderItem from "./OrderItem";

interface Props {
  orders: Order[];
}

export default function OrdersList({ orders }: Props) {
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={{ textAlign: "center" }}>
          Aún no tienes pedidos de este tipo.
        </Text>
      }
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
}
