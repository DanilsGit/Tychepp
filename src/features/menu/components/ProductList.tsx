import { FlatList, View } from "react-native";
import { Text } from "@rn-vui/base";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import ProductItem from "./ProductItem";

interface Props {
  products: Product[];
}
export default function ProductList({ products }: Props) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductItem product={item} />
      )}
      keyExtractor={(item) => JSON.stringify(item)}
      ListEmptyComponent={
        <View style={{ padding: 30, alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>
            Aún no has agregado productos
          </Text>
        </View>
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={true}
    />
  );
}
