import { Text } from "@rn-vui/base";
import { FlatList, StyleSheet, View } from "react-native";
import { colors, global_styles } from "../../../styles/global";
import { OrderProductsProduct } from "../../../types/rowTypes";

interface Props {
  orderProducts: OrderProductsProduct[];
}

export const OrderDetailsListWeb = ({ orderProducts }: Props) => {
  return (
    <View style={styles.itemsContainer}>
      {orderProducts.map((item) => (
        <View key={item.id} style={global_styles.card}>
          <Text style={styles.itemName}>
            {item.product.category_for_product.name} - {item.product.name}
          </Text>
          <Text>
            {item.comments && <Text>Observaciones: {item.comments}</Text>}
          </Text>
          <Text style={styles.priceText}>
            $
            {item.price_sold.toLocaleString("es-CO", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    width: "100%",
    maxHeight: "100%",
    overflowY: "scroll",
    marginTop: 10,
    borderBottomColor: colors.warning,
    borderBottomWidth: 5,
    borderTopWidth: 5,
    borderTopColor: colors.warning,
    backgroundColor: colors.black,
    gap: 10,
    padding: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
